// Sauvegarde hebdomadaire du contenu Sanity.
//
// Aucun jeton n'est nécessaire : sur le plan gratuit le jeu de données est
// public, donc la lecture se fait sans authentification. C'est ce qui permet
// à cette sauvegarde de tourner sans secret stocké nulle part.

import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const PROJECT = process.env.SANITY_PROJECT_ID ?? 'a9b47qot';
const DATASET = process.env.SANITY_DATASET ?? 'production';
const OUT = process.env.BACKUP_DIR ?? 'sauvegarde';

const api = (query) =>
  `https://${PROJECT}.api.sanity.io/v2024-01-01/data/query/${DATASET}?query=${encodeURIComponent(query)}`;

const fetchJson = async (url) => {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`${r.status} sur ${url}`);
  return r.json();
};

// 1. Tous les documents, brouillons exclus.
const { result: docs } = await fetchJson(
  api('*[!(_id in path("drafts.**"))] | order(_type asc, _id asc)'),
);

await mkdir(OUT, { recursive: true });
await writeFile(
  join(OUT, 'documents.ndjson'),
  docs.map((d) => JSON.stringify(d)).join('\n') + '\n',
);

// 2. Tous les fichiers (images, PDF), à leur taille d'origine.
const assets = docs.filter((d) => d._type?.startsWith('sanity.') && d.url);
await mkdir(join(OUT, 'fichiers'), { recursive: true });

let octets = 0;
for (const a of assets) {
  const nom = a.originalFilename ?? `${a._id}.${a.extension ?? 'bin'}`;
  const r = await fetch(a.url);
  if (!r.ok) {
    console.error(`  échec sur ${nom} (${r.status})`);
    continue;
  }
  const buf = Buffer.from(await r.arrayBuffer());
  await writeFile(join(OUT, 'fichiers', nom), buf);
  octets += buf.length;
}

const resume = {
  date: new Date().toISOString(),
  projet: PROJECT,
  jeuDeDonnees: DATASET,
  documents: docs.length - assets.length,
  fichiers: assets.length,
  poidsFichiers: `${(octets / 1024 / 1024).toFixed(1)} Mo`,
};
await writeFile(join(OUT, 'resume.json'), JSON.stringify(resume, null, 2) + '\n');

console.log(
  `Sauvegarde : ${resume.documents} documents, ${resume.fichiers} fichiers (${resume.poidsFichiers}).`,
);

// Un contenu vide signale presque toujours un problème, pas un site vide.
if (resume.documents === 0) {
  console.error('Aucun document récupéré — sauvegarde suspecte, arrêt en erreur.');
  process.exit(1);
}
