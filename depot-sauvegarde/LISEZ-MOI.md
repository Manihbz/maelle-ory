# Dépôt de sauvegarde — contenu de Maëlle Ory

Ce dossier est le contenu du **dépôt GitHub au nom de Maëlle**, distinct de celui
du site. Il ne contient pas le site : seulement de quoi récupérer son contenu si
le compte Sanity était perdu.

## Mise en place, une fois

1. Créer un dépôt **privé** sur le compte GitHub de Maëlle, par exemple
   `sauvegarde-site`.
2. Y copier `scripts/backup.mjs`.
3. Y copier `.github-workflows/sauvegarde.yml` **dans `.github/workflows/`** —
   le dossier est renommé ici parce que GitHub refuse qu'un fichier de workflow
   arrive par un autre chemin.
4. Onglet *Actions* → *Sauvegarde hebdomadaire du contenu* → *Run workflow*,
   pour vérifier tout de suite que ça fonctionne.

## Ce qu'elle fait

Tous les lundis à 4 h 17, et à la demande : récupération de tous les documents
publiés dans `sauvegarde/documents.ndjson`, et de tous les fichiers — images,
PDF — dans `sauvegarde/fichiers/`, à leur taille d'origine. Un `resume.json`
note la date et les quantités.

Rien n'est enregistré s'il n'y a aucun changement depuis la semaine précédente.
Et si l'export revient vide, la tâche échoue volontairement : un contenu vide
signale presque toujours un incident, pas un site vide.

## Aucun secret

Le jeu de données Sanity est public — c'est la règle du plan gratuit, et sans
conséquence ici puisque tout ce qu'il contient est destiné à être affiché. La
sauvegarde lit donc sans authentification : **aucun jeton n'est stocké nulle
part**, et il n'y a rien à faire tourner ni à renouveler.

## Pour restaurer

Depuis le projet du site, avec le CLI Sanity connecté :

```
npx sanity dataset import sauvegarde/documents.ndjson production --replace
```

Les images devront être réimportées depuis `sauvegarde/fichiers/`.
