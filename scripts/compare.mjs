// Compare le site construit depuis Sanity avec celui de la phase A.
// Les adresses d'images diffèrent forcément (CDN Sanity) : on les compte à part.
import { readdir, readFile } from 'node:fs/promises';

const strip = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const srcs = (html) => [...html.matchAll(/(?:src|href)="([^"]*)"/g)].map((m) => m[1]);

const pages = (await readdir('dist')).filter((f) => f.endsWith('.html')).sort();
let identical = 0;
const problems = [];

for (const p of pages) {
  let before;
  try {
    before = await readFile(`dist-phaseA/${p}`, 'utf8');
  } catch {
    problems.push(`${p} : absente de la version phase A`);
    continue;
  }
  const after = await readFile(`dist/${p}`, 'utf8');
  const a = strip(before);
  const b = strip(after);

  if (a === b) {
    identical++;
    console.log(`  = ${p.padEnd(16)} texte identique`);
  } else {
    const wa = a.split(' ');
    const wb = b.split(' ');
    const i = wa.findIndex((w, k) => w !== wb[k]);
    console.log(`  ≠ ${p.padEnd(16)} ÉCART au mot ${i}`);
    console.log(`      avant : …${wa.slice(Math.max(0, i - 6), i + 8).join(' ')}…`);
    console.log(`      après : …${wb.slice(Math.max(0, i - 6), i + 8).join(' ')}…`);
    problems.push(p);
  }

  const imgBefore = srcs(before).filter((s) => /\.(jpg|jpeg|png|webp)/i.test(s)).length;
  const imgAfter = srcs(after).filter((s) => /cdn\.sanity\.io|\.(jpg|jpeg|png|webp)/i.test(s)).length;
  if (imgBefore !== imgAfter) problems.push(`${p} : ${imgBefore} images avant, ${imgAfter} après`);
}

console.log(`\n${identical}/${pages.length} pages au texte strictement identique.`);
if (problems.length) {
  console.log('\nÀ regarder :');
  for (const p of problems) console.log(`  - ${p}`);
} else {
  console.log('Aucun écart, images comprises.');
}
