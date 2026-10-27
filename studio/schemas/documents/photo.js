import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'photo',
  title: 'Photo',
  type: 'document',
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      // Le point focal : placez-le sur le visage, le site recadre autour.
      options: { hotspot: true },
      validation: (r) => r.required().error('Une photo sans image ne sert à rien.'),
    }),
    defineField({
      name: 'credit',
      title: 'Crédit photographe',
      type: 'string',
      description:
        'Pré-rempli avec le crédit par défaut des réglages. Remplacez-le si cette photo est de quelqu’un d’autre.',
      // Pré-remplissage depuis les réglages du site : l'obligation reste,
      // sans avoir à retaper le même nom à chaque envoi.
      initialValue: async (props, { getClient }) => {
        const client = getClient({ apiVersion: '2024-01-01' });
        return client.fetch('*[_type == "settings"][0].defaultPhotoCredit');
      },
      validation: (r) =>
        r.required().error('Le crédit photographe est obligatoire : c’est une obligation légale.'),
    }),
    defineField({
      name: 'category',
      title: 'Catégorie',
      type: 'string',
      options: {
        list: [
          { title: 'Portrait', value: 'Portrait' },
          { title: 'Scène', value: 'Scène' },
          { title: 'Plateau', value: 'Plateau' },
        ],
        layout: 'radio',
      },
      initialValue: 'Portrait',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'caption',
      title: 'Légende',
      type: 'string',
      description:
        'Le nom du spectacle, par exemple. Sert aussi de description pour les personnes qui ne voient pas l’image.',
    }),
    defineField({
      name: 'featured',
      title: 'À la une',
      type: 'boolean',
      description: 'Remonte la photo en tête de sa catégorie.',
      initialValue: false,
    }),
  ],
  orderings: [
    { title: 'À la une d’abord', name: 'featured', by: [{ field: 'featured', direction: 'desc' }] },
  ],
  preview: {
    select: { title: 'caption', subtitle: 'category', media: 'image' },
    prepare: ({ title, subtitle, media }) => ({
      title: title || 'Sans légende',
      subtitle,
      media,
    }),
  },
});
