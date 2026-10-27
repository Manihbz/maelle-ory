// Règles d'image communes à tout le site. Deux garde-fous que la spec impose :
// le crédit photographe est obligatoire, et une image plus petite que son
// emplacement ne doit jamais être étirée.

// Le crédit se règle photo par photo. Un crédit par défaut, défini une fois
// dans les réglages du site, évite d'avoir à retaper le même nom à chaque
// envoi — c'est ce qui rend l'obligation tenable au quotidien. Il reste
// modifiable sur chaque photo.
export function resolveCredit(src, credit, fallback) {
  const chosen = (credit ?? '').trim() || (fallback ?? '').trim();
  if (chosen === '') {
    throw new Error(
      `Crédit photographe manquant pour « ${src} », et aucun crédit par défaut ` +
        `n'est réglé. Toute image publiée doit porter son crédit (spec, modèle de contenu).`,
    );
  }
  return chosen;
}

export function assertCredit(src, credit) {
  return resolveCredit(src, credit, '');
}

// Largeur maximale réelle d'une image : jamais au-delà de sa définition
// native, quelle que soit la place disponible.
export function naturalCap(width) {
  return Number.isFinite(width) && width > 0 ? `${width}px` : '100%';
}

// Les auteurs distincts, dans l'ordre d'apparition — pour le pied de page.
export function creditList(photos, fallback) {
  const seen = [];
  for (const p of photos ?? []) {
    const name = (p.credit ?? '').trim() || (fallback ?? '').trim();
    if (name && !seen.includes(name)) seen.push(name);
  }
  return seen;
}
