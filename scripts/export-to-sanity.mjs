// Transforme le contenu de la phase A en fichier d'import Sanity.
// Les images sont référencées par leur chemin local : la commande d'import
// les téléverse et crée les références toute seule.
import { readFile, writeFile } from 'node:fs/promises';

const c = JSON.parse(await readFile('src/data/content.json', 'utf8'));
const lines = [];
const slug = (s) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

let k = 0;
const key = () => `k${(k++).toString(36)}`;
const asset = (src) => ({ _sanityAsset: `image@file://./public/${src.replace(/^photos\//, 'photos/')}` });
const push = (doc) => lines.push(JSON.stringify(doc));

// Réglages du site
push({
  _id: 'settings',
  _type: 'settings',
  title: c.site.name,
  description: c.site.description,
  defaultPhotoCredit: c.site.defaultPhotoCredit,
  shareImage: asset(c.site.shareImage),
});

// Accueil
push({
  _id: 'home',
  _type: 'home',
  heroImage: asset(c.home.heroImage),
  heroCredit: c.home.heroCredit,
  line: c.home.line,
});

// Biographie, en texte riche
push({
  _id: 'bio',
  _type: 'bio',
  body: c.bio.map((p) => ({
    _type: 'block',
    _key: key(),
    style: 'normal',
    markDefs: [],
    children: [{ _type: 'span', _key: key(), text: p, marks: [] }],
  })),
});

// Contact
push({
  _id: 'contact',
  _type: 'contact',
  email: `${c.contact.emailUser}@${c.contact.emailDomain}`,
  phone: c.contact.phone,
  phonePublic: true,
  socials: c.contact.socials.map((s) => ({ _type: 'object', _key: key(), ...s })),
});

// Photos
const photoId = (p) => `photo-${slug(p.src.replace(/^photos\//, '').replace(/\.[a-z]+$/i, ''))}`;
for (const p of c.photos) {
  push({
    _id: photoId(p),
    _type: 'photo',
    image: asset(p.src),
    credit: p.credit,
    category: p.category,
    caption: p.caption ?? undefined,
    featured: false,
  });
}

// Lignes de CV
for (const l of c.cv) {
  push({
    _id: `cv-${slug(l.category)}-${slug(l.title)}`,
    _type: 'cvLine',
    category: l.category,
    title: l.title,
    year: l.year ?? undefined,
    position: l.position ?? undefined,
    role: l.role ?? undefined,
    director: l.director ?? undefined,
    company: l.company ?? undefined,
    with: l.with ?? undefined,
  });
}

// Vidéos
for (const v of c.videos) {
  push({
    _id: `video-${slug(v.title)}`,
    _type: 'video',
    title: v.title,
    kind: v.kind,
    url: v.url,
    featured: !!v.featured,
    synopsis: v.synopsis ?? undefined,
    director: v.title === 'Diogène' ? 'Marc Vital Guerin' : undefined,
    year: v.title === 'Diogène' ? 2025 : undefined,
    duration: v.title === 'Diogène' ? '13 min 16 s' : undefined,
  });
}

// Dates
for (const d of c.dates) {
  push({
    _id: `perf-${d.start}-${slug(d.title)}`,
    _type: 'performance',
    title: d.title,
    kind: 'Théâtre',
    start: d.start,
    end: d.end ?? undefined,
    venue: d.venue ?? undefined,
    city: d.city ?? undefined,
    link: d.link ?? undefined,
    linkLabel: d.linkLabel ?? undefined,
    note: d.note ?? undefined,
  });
}

// Ateliers
for (const a of c.ateliers) {
  push({
    _id: `atelier-${slug(a.name)}`,
    _type: 'atelier',
    name: a.name,
    audience: a.audience ?? undefined,
    partner: a.partner ?? undefined,
    place: a.place ?? undefined,
    rhythm: a.rhythm ?? undefined,
    period: a.period ?? undefined,
    description: a.description ?? undefined,
    howTo: a.howTo ?? undefined,
  });
}

await writeFile('import-sanity.ndjson', lines.join('\n') + '\n');
const byType = {};
for (const l of lines) {
  const t = JSON.parse(l)._type;
  byType[t] = (byType[t] ?? 0) + 1;
}
console.log(`${lines.length} documents prêts :`);
for (const [t, n] of Object.entries(byType).sort()) console.log(`  ${n.toString().padStart(2)} × ${t}`);
