import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'bio',
  title: 'Biographie',
  type: 'document',
  fields: [
    defineField({
      name: 'body',
      title: 'Texte',
      type: 'array',
      of: [{ type: 'block', styles: [{ title: 'Paragraphe', value: 'normal' }], lists: [] }],
      description: 'Du texte courant. Gras et italique disponibles ; pas de titres, la page s’en charge.',
    }),
  ],
  preview: { prepare: () => ({ title: 'Biographie' }) },
});
