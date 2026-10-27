import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'press',
  title: 'Article de presse',
  type: 'document',
  fields: [
    defineField({
      name: 'quote',
      title: 'Citation',
      type: 'text',
      rows: 3,
      description: 'La phrase qui claque. C’est elle qui s’affiche en grand.',
      validation: (r) => r.required(),
    }),
    defineField({ name: 'source', title: 'Source', type: 'string', description: 'Nom du journal ou du site.' }),
    defineField({ name: 'date', title: 'Date', type: 'date', options: { dateFormat: 'DD/MM/YYYY' } }),
    defineField({ name: 'url', title: 'Lien vers l’article', type: 'url' }),
    defineField({ name: 'excerpt', title: 'Extrait plus long', type: 'text', rows: 6 }),
  ],
  orderings: [{ title: 'Plus récent d’abord', name: 'date', by: [{ field: 'date', direction: 'desc' }] }],
  preview: {
    select: { title: 'quote', subtitle: 'source' },
    prepare: ({ title, subtitle }) => ({ title: title?.slice(0, 70), subtitle }),
  },
});
