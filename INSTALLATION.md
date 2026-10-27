# Installation — site de Maëlle Ory

Projet Sanity : **a9b47qot**, jeu de données **production**.

## 1. Le back-office

```bash
cd studio
npm install
npx sanity login          # ouvre le navigateur, à faire avec le compte de Maëlle
npx sanity deploy         # choisir une adresse, par exemple maelleory
```

Le Studio est alors accessible sur `https://<adresse-choisie>.sanity.studio`.

## 2. Importer le contenu

Depuis la racine du projet, pas depuis `studio/` : les images sont référencées
relativement à `./public/photos/`.

```bash
npx sanity dataset import import-sanity.ndjson production --replace
```

21 documents, dont 6 photos téléversées avec leur crédit. L'option `--replace`
rend la commande rejouable sans créer de doublons.

## 3. Vérifier

Ouvrir le Studio : les dates, photos, vidéos, lignes de CV et ateliers doivent
être là, et les quatre pages uniques — Accueil, Biographie, Contact, Réglages —
remplies.

## 4. Le site

```bash
npm install
npm run build             # version réelle, avec les lecteurs vidéo
PUBLIC_PREVIEW=1 npm run build   # version d'aperçu, sans lecteurs tiers
node --test test/lib.test.js                  # 13 tests
```

## Ce qui reste à faire après l'import

- Basculer `src/lib/content.js` du fichier local vers Sanity
- Brancher le signal de publication Sanity → Netlify
- Mettre en place la sauvegarde hebdomadaire vers le dépôt GitHub de Maëlle
