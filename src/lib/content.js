// Couche de données unique du site — version Sanity.
//
// Même contrat qu'en phase A : getContent() renvoie un objet de la même forme,
// donc aucune page ni aucun composant n'a été modifié lors de la bascule.
// La récupération se fait une fois au chargement du module, ce qui permet de
// garder getContent() synchrone et de ne pas ajouter d'await partout.

import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';

const client = createClient({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID ?? 'a9b47qot',
  dataset: import.meta.env.PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  useCdn: false, // la construction doit voir la dernière publication, pas un cache
});

const urlFor = createImageUrlBuilder(client);

const IMAGE = `{
  asset->{ url, metadata { dimensions, lqip } },
  hotspot,
  crop
}`;

const QUERY = `{
  "settings": *[_id == "settings"][0]{ title, description, defaultPhotoCredit, shareImage ${IMAGE} },
  "home": *[_id == "home"][0]{ heroImage ${IMAGE}, heroCredit, line },
  "bio": *[_id == "bio"][0].body,
  "contact": *[_id == "contact"][0]{ email, phone, phonePublic, agent, socials },
  "photos": *[_type == "photo"] | order(featured desc, category asc, _createdAt asc){
    image ${IMAGE}, credit, category, caption
  },
  // Trois critères, dans cet ordre : la position que Maëlle a fixée à la main
  // (pour les spectacles qui tournent en même temps), puis l'année décroissante,
  // puis l'alphabet. Le CV ne peut donc jamais se réordonner tout seul.
  "cv": *[_type == "cvLine"] | order(coalesce(position, 9999) asc, coalesce(year, 0) desc, title asc){
    category, title, year, position, role, director, company, with
  },
  "videos": *[_type == "video"] | order(featured desc, _createdAt asc){
    title, kind, url, featured, director, year, duration, synopsis
  },
  "dates": *[_type == "performance"]{ title, kind, start, end, time, venue, city, link, linkLabel, note },
  "ateliers": *[_type == "atelier"]{ name, audience, partner, place, rhythm, period, description, howTo },
  "press": *[_type == "press"] | order(date desc){ quote, source, date, url, excerpt }
}`;

// Texte riche → paragraphes simples : les pages attendent des chaînes.
const blocksToText = (blocks) =>
  (blocks ?? [])
    .filter((b) => b._type === 'block')
    .map((b) => (b.children ?? []).map((c) => c.text).join(''))
    .filter((t) => t.trim() !== '');

const sized = (img, width, height) => {
  if (!img?.asset) return null;
  let b = urlFor.image(img).width(width).auto('format');
  if (height) b = b.height(height).fit('crop');
  return b.url();
};

const dims = (img) => img?.asset?.metadata?.dimensions ?? {};

function shape(raw) {
  const s = raw.settings ?? {};
  const h = raw.home ?? {};
  const c = raw.contact ?? {};
  const [emailUser = '', emailDomain = ''] = (c.email ?? '').split('@');

  return {
    site: {
      name: s.title ?? 'Maëlle Ory',
      description: s.description ?? '',
      shareImage: sized(s.shareImage, 1200, 630) ?? sized(h.heroImage, 1200, 630),
      defaultPhotoCredit: s.defaultPhotoCredit ?? '',
    },
    home: {
      // Le bandeau est un 16:9 recadré autour du point focal réglé dans le back-office.
      heroImage: sized(h.heroImage, 1920, 1080),
      heroLqip: h.heroImage?.asset?.metadata?.lqip ?? null,
      heroCredit: h.heroCredit ?? s.defaultPhotoCredit ?? '',
      line: h.line ?? '',
    },
    bio: blocksToText(raw.bio),
    cv: (raw.cv ?? []).map((l) => ({
      category: l.category,
      title: l.title,
      year: l.year ?? null,
      position: l.position ?? null,
      role: l.role ?? null,
      director: l.director ?? null,
      company: l.company ?? null,
      with: l.with ?? null,
    })),
    videos: (raw.videos ?? []).map((v) => ({
      title: v.title,
      kind: v.kind,
      url: v.url,
      featured: !!v.featured,
      meta:
        [v.director && `Un film de ${v.director}`, v.year, v.duration].filter(Boolean).join(' · ') ||
        null,
      synopsis: v.synopsis ?? null,
    })),
    photos: (raw.photos ?? []).map((p) => {
      const d = dims(p.image);
      // On ne demande jamais plus large que l'original : une image de 1220 px
      // reste servie à 1220 px et ne sera pas étirée par la mise en page.
      const width = Math.min(d.width ?? 1600, 1600);
      return {
        src: sized(p.image, width),
        alt: p.caption ? `${p.caption} — Maëlle Ory` : 'Portrait de Maëlle Ory',
        credit: p.credit ?? null,
        category: p.category,
        caption: p.caption ?? null,
        width,
        height: d.height && d.width ? Math.round((width * d.height) / d.width) : null,
      };
    }),
    dates: (raw.dates ?? []).map((d) => ({
      title: d.title,
      start: d.start,
      end: d.end ?? null,
      venue: d.venue ?? null,
      city: d.city ?? null,
      link: d.link ?? null,
      linkLabel: d.linkLabel ?? null,
      note: d.note ?? null,
    })),
    ateliers: (raw.ateliers ?? []).map((a) => ({
      name: a.name,
      audience: a.audience ?? null,
      partner: a.partner ?? null,
      place: a.place ?? null,
      rhythm: a.rhythm ?? null,
      period: a.period ?? null,
      description: a.description ?? null,
      howTo: a.howTo ?? null,
    })),
    press: (raw.press ?? []).map((p) => ({
      quote: p.quote,
      source: p.source ?? null,
      date: p.date ?? null,
      url: p.url ?? null,
      excerpt: p.excerpt ?? null,
    })),
    contact: {
      emailUser,
      emailDomain,
      phone: c.phone ?? '',
      phonePublic: c.phonePublic !== false,
      agent: c.agent ?? null,
      socials: c.socials ?? [],
    },
  };
}

// Une seule requête pour tout le site, au chargement du module.
const data = shape(await client.fetch(QUERY));

export function getContent() {
  return data;
}

export function getSection(name) {
  return data[name];
}
