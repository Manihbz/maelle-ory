import { defineField, defineType } from 'sanity';

export default defineType({
  // « date » est un type réservé par Sanity : un document ainsi nommé masque
  // le sélecteur de date natif. Le nom interne change, pas le libellé.
  name: 'performance',
  title: 'Date',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titre du projet',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'kind',
      title: 'Type',
      type: 'string',
      options: {
        list: ['Théâtre', 'Cinéma', 'Télévision', 'Lecture', 'Atelier', 'Autre'],
        layout: 'radio',
      },
      initialValue: 'Théâtre',
    }),
    defineField({
      name: 'start',
      title: 'Date de début',
      type: 'date',
      options: { dateFormat: 'DD/MM/YYYY' },
      validation: (r) => r.required().error('Sans date de début, impossible de la classer.'),
    }),
    defineField({
      name: 'end',
      title: 'Date de fin',
      type: 'date',
      description: 'À remplir seulement pour une série de représentations.',
      options: { dateFormat: 'DD/MM/YYYY' },
      validation: (r) =>
        r.custom((end, ctx) =>
          !end || !ctx.document?.start || end >= ctx.document.start
            ? true
            : 'La date de fin est antérieure à la date de début.',
        ),
    }),
    defineField({ name: 'time', title: 'Horaire', type: 'string', description: 'Par exemple 20 h 30.' }),
    defineField({ name: 'venue', title: 'Lieu', type: 'string' }),
    defineField({ name: 'city', title: 'Ville', type: 'string' }),
    defineField({
      name: 'link',
      title: 'Lien',
      type: 'url',
      description:
        'Billetterie, page du théâtre, événement. Affiché seulement tant que la date est à venir.',
    }),
    defineField({
      name: 'linkLabel',
      title: 'Libellé du lien',
      type: 'string',
      description: 'Si vide : « Réserver ».',
      hidden: ({ document }) => !document?.link,
    }),
    defineField({ name: 'note', title: 'Note', type: 'string', description: 'Une ligne, pas plus.' }),
    defineField({ name: 'photo', title: 'Photo', type: 'reference', to: [{ type: 'photo' }] }),
  ],
  orderings: [
    { title: 'La plus proche d’abord', name: 'start', by: [{ field: 'start', direction: 'desc' }] },
  ],
  preview: {
    select: { title: 'title', start: 'start', venue: 'venue', city: 'city' },
    prepare: ({ title, start, venue, city }) => ({
      title,
      subtitle: [start, venue, city].filter(Boolean).join(' · '),
    }),
  },
});
