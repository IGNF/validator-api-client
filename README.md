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

Prérequis : Node.js 22 ou plus, et une instance de [IGNF/validator-api](https://github.com/IGNF/validator-api) (par défaut sur `https://127.0.0.1:8001`).

```bash
npm install
# build en continu du front
npm run watch
# serveur de démo sur http://localhost:3000
npm run start
# tests
npm test
```

Le serveur de démo (`server.js`) relaie la spécification OpenAPI de l'API (`/api/validator-api.yml` et `/api/schema/*`) pour éviter les problèmes de CORS et de certificat auto-signé. Il se configure par variables d'environnement :

| Variable | Défaut | Description |
|----------|--------|-------------|
| `PORT` | `3000` | Port d'écoute |
| `VALIDATOR_API_URL` | `https://127.0.0.1:8001` | Origine de validator-api (proxy de la spec et CSP) |
| `VALIDATOR_SPECS_URL` | `$VALIDATOR_API_URL/api/validator-api.yml` | URL de la spécification OpenAPI |

L'URL de l'API appelée par le navigateur est définie dans `public/index.html`.

Pour une nouvelle version, penser à **mettre à jour le numéro de version** dans le `package.json` et à reconstruire `dist/` (la CI vérifie qu'il est à jour) :

```bash
npm run build
```

## Usage

Ce démonstrateur est inclus dans [IGNF/validator-api](https://github.com/IGNF/validator-api). Si toutefois vous souhaitez déployer séparément l'API et le démonstrateur, suivez les instructions dans la fiche [intégration dans une application existante](docs/integration-application.md)

## Licence

Ce paquet est publié sous licence [AGPL-3.0-or-later](LICENSE). Lorsqu'il est intégré comme dépendance d'une application tierce (par exemple le backend d'IGNF/validator-api), la compatibilité de cette licence avec le mode de distribution de l'application hôte est à valider par les équipes concernées.
