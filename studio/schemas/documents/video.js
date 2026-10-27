import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'video',
  title: 'Vidéo',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Titre', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'kind',
      title: 'Type',
      type: 'string',
      options: {
        list: ['Bande démo', 'Court métrage', 'Extrait', 'Bande-annonce'],
        layout: 'radio',
      },
      initialValue: 'Extrait',
    }),
    defineField({
      name: 'url',
      title: 'Adresse de la vidéo',
      type: 'url',
      description:
        'Collez l’adresse YouTube ou Vimeo telle quelle. Les paramètres de suivi sont ignorés.',
      validation: (r) =>
        r
          .required()
          .custom((url) =>
            !url || /(?:youtube\.com|youtu\.be|vimeo\.com)/.test(url)
              ? true
              : 'Seules les adresses YouTube et Vimeo fonctionnent sur le site.',
          ),
    }),
    defineField({
      name: 'featured',
      title: 'Vidéo principale',
      type: 'boolean',
      description: 'Celle qui apparaît sur la page d’accueil. Une seule à la fois.',
      initialValue: false,
    }),
    defineField({ name: 'director', title: 'Réalisation', type: 'string' }),
    defineField({ name: 'year', title: 'Année', type: 'number' }),
    defineField({ name: 'duration', title: 'Durée', type: 'string', description: 'Par exemple 13 min 16 s.' }),
    defineField({ name: 'synopsis', title: 'Synopsis', type: 'text', rows: 5 }),
  ],
  preview: {
    select: { title: 'title', kind: 'kind', featured: 'featured' },
    prepare: ({ title, kind, featured }) => ({
      title: featured ? `★ ${title}` : title,
      subtitle: kind,
    }),
  },
});
