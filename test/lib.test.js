import test from 'node:test';
import assert from 'node:assert/strict';
import { parseVideoUrl } from '../src/lib/video.js';
import { splitDates, formatRange } from '../src/lib/dates.js';
import { assertCredit, naturalCap, resolveCredit, creditList } from '../src/lib/images.js';

test('parseVideoUrl reconnaît une adresse YouTube longue', () => {
  const v = parseVideoUrl('https://www.youtube.com/watch?v=MterTIZk-os');
  assert.equal(v.platform, 'youtube');
  assert.equal(v.id, 'MterTIZk-os');
  assert.match(v.embedUrl, /MterTIZk-os/);
});

test('parseVideoUrl reconnaît une adresse YouTube courte avec paramètre de suivi', () => {
  const v = parseVideoUrl('https://youtu.be/YLuoKsOuclQ?si=nTtm5R_Qc62oJFZk');
  assert.equal(v.platform, 'youtube');
  assert.equal(v.id, 'YLuoKsOuclQ');
});

test('parseVideoUrl reconnaît une adresse Vimeo non répertoriée avec sa clé', () => {
  const v = parseVideoUrl('https://vimeo.com/1196702669/ba8edb9695');
  assert.equal(v.platform, 'vimeo');
  assert.equal(v.id, '1196702669');
  assert.match(v.embedUrl, /h=ba8edb9695/);
});

test('parseVideoUrl renvoie null sur une plateforme non prévue', () => {
  assert.equal(parseVideoUrl('https://www.dailymotion.com/video/x8abcd'), null);
  assert.equal(parseVideoUrl(''), null);
  assert.equal(parseVideoUrl(null), null);
});

test('splitDates range une représentation du jour dans les dates à venir', () => {
  const now = new Date('2026-03-12T18:00:00');
  const { upcoming, past } = splitDates(
    [{ title: 'Ce soir', start: '2026-03-12', end: '2026-03-12' }],
    now,
  );
  assert.equal(upcoming.length, 1);
  assert.equal(past.length, 0);
});

test('splitDates trie les à venir par date croissante et les passées par date décroissante', () => {
  const now = new Date('2026-03-12T10:00:00');
  const { upcoming, past } = splitDates(
    [
      { title: 'Plus tard', start: '2026-05-02' },
      { title: 'Bientôt', start: '2026-03-20' },
      { title: 'Ancienne', start: '2025-11-04' },
      { title: 'Récente', start: '2026-02-01' },
    ],
    now,
  );
  assert.deepEqual(
    upcoming.map((d) => d.title),
    ['Bientôt', 'Plus tard'],
  );
  assert.deepEqual(
    past.map((d) => d.title),
    ['Récente', 'Ancienne'],
  );
});

test('formatRange écrit une série et une date unique en français', () => {
  assert.equal(formatRange('2026-03-12', '2026-03-24'), '12 → 24 mars 2026');
  assert.equal(formatRange('2026-04-03', '2026-04-03'), '3 avril 2026');
  assert.equal(formatRange('2026-04-28', '2026-05-02'), '28 avril → 2 mai 2026');
});

test('splitDates encaisse une date de fin antérieure au début', () => {
  const now = new Date('2026-03-12T10:00:00Z');
  const { upcoming, past } = splitDates(
    [{ title: 'Saisie fautive', start: '2026-06-01', end: '2026-05-01' }],
    now,
  );
  assert.equal(upcoming.length, 1);
  assert.equal(past.length, 0);
  assert.equal(upcoming[0].title, 'Saisie fautive');
});

test('splitDates garde deux représentations du même jour au même lieu comme deux entrées', () => {
  const now = new Date('2026-03-01T10:00:00Z');
  const { upcoming } = splitDates(
    [
      { title: 'Séance de 18 h', start: '2026-04-10', venue: 'Théâtre X' },
      { title: 'Séance de 21 h', start: '2026-04-10', venue: 'Théâtre X' },
    ],
    now,
  );
  assert.equal(upcoming.length, 2);
  assert.notEqual(upcoming[0].title, upcoming[1].title);
});

test('assertCredit refuse une image sans crédit et nomme le fichier', () => {
  assert.throws(() => assertCredit('photos/novecento-duo.jpg', ''), /novecento-duo\.jpg/);
  assert.throws(() => assertCredit('photos/x.jpg', null), /Crédit photographe manquant/);
  assert.equal(assertCredit('photos/x.jpg', ' Adrien Brullion '), 'Adrien Brullion');
});

test('naturalCap empêche d’étirer une image plus petite que son emplacement', () => {
  assert.equal(naturalCap(1220), '1220px');
  assert.equal(naturalCap(undefined), '100%');
});

test('resolveCredit retombe sur le crédit par défaut, et refuse si les deux manquent', () => {
  assert.equal(resolveCredit('photos/a.jpg', '', 'Adrien Brullion'), 'Adrien Brullion');
  assert.equal(resolveCredit('photos/a.jpg', 'Jean Dupont', 'Adrien Brullion'), 'Jean Dupont');
  assert.throws(() => resolveCredit('photos/a.jpg', '', ''), /aucun crédit par défaut/);
});

test('creditList ne liste chaque photographe qu’une fois', () => {
  const photos = [
    { credit: 'Adrien Brullion' },
    { credit: '' },
    { credit: 'Jean Dupont' },
    { credit: 'Adrien Brullion' },
  ];
  assert.deepEqual(creditList(photos, 'Adrien Brullion'), ['Adrien Brullion', 'Jean Dupont']);
});
