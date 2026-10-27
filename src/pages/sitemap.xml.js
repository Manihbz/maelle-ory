const PAGES = [
  { path: '', priority: '1.0' },
  { path: 'parcours.html', priority: '0.9' },
  { path: 'photos.html', priority: '0.8' },
  { path: 'videos.html', priority: '0.8' },
  { path: 'agenda.html', priority: '0.9' },
  { path: 'ateliers.html', priority: '0.6' },
  { path: 'contact.html', priority: '0.6' },
];

export function GET({ site }) {
  const origin = (site ?? new URL('https://maelleory.fr')).origin;
  const today = new Date().toISOString().slice(0, 10);
  const urls = PAGES.map(
    (p) =>
      `  <url><loc>${origin}/${p.path}</loc><lastmod>${today}</lastmod><priority>${p.priority}</priority></url>`,
  ).join('\n');

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    { headers: { 'Content-Type': 'application/xml' } },
  );
}
