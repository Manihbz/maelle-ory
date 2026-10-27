import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'settings',
  title: 'Réglages du site',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Titre du site', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'description',
      title: 'Description pour Google',
      type: 'text',
      rows: 3,
      description: 'Deux lignes. C’est ce qui s’affiche sous le lien dans les résultats de recherche.',
      validation: (r) => r.max(160).warning('Au-delà de 160 caractères, Google coupe.'),
    }),
    defineField({
      name: 'shareImage',
      title: 'Image de partage',
      type: 'image',
      description: 'L’image qui apparaît quand vous collez le lien du site dans un message ou une story.',
      options: { hotspot: true },
    }),
    defineField({
      name: 'defaultPhotoCredit',
      title: 'Crédit photographe par défaut',
      type: 'string',
      description:
        'Pré-remplit le crédit de chaque nouvelle photo. Modifiable photo par photo.',
    }),
    defineField({ name: 'cvPdf', title: 'CV en PDF', type: 'file' }),
    defineField({ name: 'pressKit', title: 'Dossier de presse', type: 'file' }),
  ],
  preview: { prepare: () => ({ title: 'Réglages du site' }) },
});
