// Réécrit les chemins absolus en chemins relatifs pour que le site
// puisse être servi depuis n'importe quel sous-dossier (aperçu publié).
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const dist = 'dist';
const files = (await readdir(dist, { recursive: true })).filter((f) => f.endsWith('.html'));

for (const f of files) {
  const p = join(dist, f);
  const html = await readFile(p, 'utf8');
  const fixed = html
    .replaceAll('href="/', 'href="')
    .replaceAll('src="/', 'src="')
    .replaceAll('srcset="/', 'srcset="')
    .replaceAll('content="/', 'content="');
  await writeFile(p, fixed);
}
console.log(`relativize: ${files.length} page(s)`);
