import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'contact',
  title: 'Contact',
  type: 'document',
  fields: [
    defineField({
      name: 'email',
      title: 'Adresse e-mail',
      type: 'string',
      description: 'Affichée sous une forme protégée des robots collecteurs.',
      validation: (r) => r.required().email(),
    }),
    defineField({ name: 'phone', title: 'Téléphone', type: 'string' }),
    defineField({
      name: 'phonePublic',
      title: 'Afficher le téléphone en clair',
      type: 'boolean',
      description:
        'Décoché, le numéro n’apparaît qu’après un clic. En clair, il sera aspiré par les robots.',
      initialValue: true,
    }),
    defineField({ name: 'agent', title: 'Agent', type: 'string', description: 'Nom, structure, coordonnées.' }),
    defineField({
      name: 'socials',
      title: 'Réseaux',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', title: 'Réseau', type: 'string' },
            { name: 'handle', title: 'Pseudo', type: 'string' },
            { name: 'url', title: 'Adresse', type: 'url' },
          ],
          preview: { select: { title: 'name', subtitle: 'handle' } },
        },
      ],
    }),
  ],
  preview: { prepare: () => ({ title: 'Contact' }) },
});
