import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'home',
  title: 'Accueil',
  type: 'document',
  fields: [
    defineField({
      name: 'heroImage',
      title: 'Portrait du bandeau',
      type: 'image',
      description: 'Placez le point focal sur le visage : le site recadre autour, sur tous les écrans.',
      options: { hotspot: true },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'heroCredit',
      title: 'Crédit du portrait',
      type: 'string',
      initialValue: async (props, { getClient }) =>
        getClient({ apiVersion: '2024-01-01' }).fetch('*[_type == "settings"][0].defaultPhotoCredit'),
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'line',
      title: 'Ligne de situation',
      type: 'text',
      rows: 3,
      description: 'Deux ou trois phrases, pas plus. C’est la première chose qu’on lit après votre nom.',
    }),
  ],
  preview: { prepare: () => ({ title: 'Accueil' }) },
});
