// Tri et mise en forme des dates. Une représentation du jour compte comme
// à venir ; les dates passées descendent mais ne disparaissent jamais.

const MOIS = [
  'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
];

function dayNumber(iso) {
  // Toujours en UTC des deux côtés : sinon une date du jour bascule
  // dans le passé pour tout fuseau à l'est de Greenwich.
  return Math.floor(Date.parse(`${iso}T00:00:00Z`) / 86400000);
}

export function splitDates(dates, now = new Date()) {
  const today = Math.floor(
    Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / 86400000,
  );

  const upcoming = [];
  const past = [];

  for (const d of dates ?? []) {
    if (!d?.start) continue;
    // Une fin antérieure au début est une saisie fautive : on se fie au début.
    const last = Math.max(dayNumber(d.start), dayNumber(d.end ?? d.start));
    (last >= today ? upcoming : past).push(d);
  }

  upcoming.sort((a, b) => dayNumber(a.start) - dayNumber(b.start));
  past.sort((a, b) => dayNumber(b.start) - dayNumber(a.start));

  return { upcoming, past };
}

export function formatRange(start, end) {
  if (!start) return '';
  const [ay, am, ad] = start.split('-').map(Number);
  if (!end || end === start) return `${ad} ${MOIS[am - 1]} ${ay}`;

  const [by, bm, bd] = end.split('-').map(Number);
  if (ay === by && am === bm) return `${ad} → ${bd} ${MOIS[am - 1]} ${ay}`;
  if (ay === by) return `${ad} ${MOIS[am - 1]} → ${bd} ${MOIS[bm - 1]} ${ay}`;
  return `${ad} ${MOIS[am - 1]} ${ay} → ${bd} ${MOIS[bm - 1]} ${by}`;
}
