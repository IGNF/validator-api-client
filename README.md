# IGNF/validator-api-client

[![License: AGPL-3.0](https://img.shields.io/badge/License-AGPL--3.0-blue.svg)](LICENSE)

## Description

Démonstrateur pour appel à l'API [IGNF/validator-api](https://github.com/IGNF/validator-api).

> :warning: **ce démonstrateur contient des éléments éditoriaux et une charte graphique propres à l'IGN**. Il vous appartient de surcharger ces éléments si vous envisagez un déploiement public.

## Fonctionnalités

* Lancer une validation sur une archive ZIP en choisissant un standard
* Visualiser le résultat d'une validation en connaissant son identifiant
* Télécharger les résultats

## Développement

```bash
npm install
# build en continu du front
npm run watch
# lancement du back
npm run start
```

Pour une nouvelle version, penser à **mettre à jour le numéro de version** dans le `package.json` et à reconstruire `dist/validator-client.js` :

```bash
npm run build
```

## Usage

Ce démonstrateur est inclus dans [IGNF/validator-api](https://github.com/IGNF/validator-api). Si toutefois vous souhaitez déployer séparément l'API et le démonstrateur, suivez les instructions dans la fiche [intégration dans une application existante](docs/integration-application.md)
