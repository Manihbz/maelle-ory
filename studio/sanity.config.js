import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { frFRLocale } from '@sanity/locale-fr-fr';
import { schemaTypes, SINGLETONS } from './schemas/index.js';
import { structure } from './structure.js';

const SINGLETON_TYPES = new Set(SINGLETONS.map((s) => s.name));

export default defineConfig({
  // Un studio à espace de travail unique se nomme « default » par convention :
  // c'est ce nom que le tableau de bord Sanity attend dans l'adresse.
  name: 'default',
  title: 'Site de Maëlle Ory',

  // Renseignés le jour de la création du compte, au nom de Maëlle.
  projectId: process.env.SANITY_STUDIO_PROJECT_ID ?? '',
  dataset: process.env.SANITY_STUDIO_DATASET ?? 'production',

  plugins: [structureTool({ structure }), frFRLocale()],

  schema: {
    types: schemaTypes,
    // Les pages uniques ne doivent pas pouvoir être dupliquées ni supprimées.
    templates: (prev) => prev.filter((t) => !SINGLETON_TYPES.has(t.schemaType)),
  },

  document: {
    actions: (prev, { schemaType }) =>
      SINGLETON_TYPES.has(schemaType)
        ? prev.filter(({ action }) => ['publish', 'discardChanges', 'restore'].includes(action))
        : prev,
  },
});
