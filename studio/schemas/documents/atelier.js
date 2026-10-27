import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'atelier',
  title: 'Atelier',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Nom de l’atelier', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'audience', title: 'Public visé', type: 'string' }),
    defineField({ name: 'partner', title: 'Avec', type: 'string', description: 'Association, structure partenaire.' }),
    defineField({ name: 'place', title: 'Lieu', type: 'string' }),
    defineField({ name: 'rhythm', title: 'Rythme', type: 'string', description: 'Par exemple : tous les mardis, 19 h – 21 h.' }),
    defineField({ name: 'period', title: 'Période', type: 'string', description: 'Par exemple : d’octobre à juin.' }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 6 }),
    defineField({ name: 'photo', title: 'Photo', type: 'reference', to: [{ type: 'photo' }] }),
    defineField({
      name: 'howTo',
      title: 'Comment s’inscrire',
      type: 'text',
      rows: 3,
      description: 'Pas de formulaire sur le site : dites simplement comment vous joindre.',
    }),
  ],
  preview: { select: { title: 'name', subtitle: 'audience' } },
});
