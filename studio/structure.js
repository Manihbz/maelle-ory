// L'ordre du menu du back-office suit la fréquence d'usage, pas l'alphabet :
// les dates en premier, les réglages en dernier.
const SINGLETON = (S, id, title) =>
  S.listItem()
    .title(title)
    .id(id)
    .child(S.document().schemaType(id).documentId(id).title(title));

export const structure = (S) =>
  S.list()
    .title('Le site')
    .items([
      S.documentTypeListItem('performance').title('Dates'),
      S.documentTypeListItem('photo').title('Photos'),
      S.documentTypeListItem('video').title('Vidéos'),
      S.documentTypeListItem('cvLine').title('Lignes de CV'),
      S.documentTypeListItem('atelier').title('Ateliers'),
      S.documentTypeListItem('press').title('Presse'),
      S.divider(),
      SINGLETON(S, 'home', 'Accueil'),
      SINGLETON(S, 'bio', 'Biographie'),
      SINGLETON(S, 'contact', 'Contact'),
      SINGLETON(S, 'settings', 'Réglages du site'),
    ]);
