import { defineField, defineType } from 'sanity';

export const CV_CATEGORIES = [
  'Théâtre',
  'Cinéma',
  'Télévision',
  'Doublage et voix',
  'Publicité',
  'Formation',
];

export default defineType({
  name: 'cvLine',
  title: 'Ligne de CV',
  type: 'document',
  fields: [
    defineField({
      name: 'category',
      title: 'Catégorie',
      type: 'string',
      options: { list: CV_CATEGORIES },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'title', title: 'Titre de l’œuvre', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'year', title: 'Année', type: 'number', validation: (r) => r.min(1950).max(2100) }),
    defineField({
      name: 'position',
      title: 'Ordre d’affichage',
      type: 'number',
      description:
        'Pour ranger à la main les spectacles qui tournent en même temps : 1 pour celui qui vient en premier, 2 ensuite, etc. Laissez vide pour un classement par année.',
      validation: (r) => r.min(1).integer(),
    }),
    defineField({ name: 'role', title: 'Rôle', type: 'string' }),
    defineField({ name: 'director', title: 'Mise en scène ou réalisation', type: 'string' }),
    defineField({ name: 'company', title: 'Compagnie ou production', type: 'string' }),
    defineField({ name: 'with', title: 'Avec', type: 'string', description: 'Partenaire de jeu.' }),
  ],
  orderings: [
    { title: 'Année décroissante', name: 'year', by: [{ field: 'year', direction: 'desc' }] },
  ],
  preview: {
    select: { title: 'title', year: 'year', category: 'category', role: 'role' },
    prepare: ({ title, year, category, role }) => ({
      title: [year, title].filter(Boolean).join(' — '),
      subtitle: [category, role].filter(Boolean).join(' · '),
    }),
  },
});
