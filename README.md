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

Le serveur de démo (`server.js`) relaie vers validator-api les appels à l'API (`/api/*`, dont la spécification OpenAPI) et les routes de connexion OIDC (`/login`, `/login_check`, `/logout`, et `/_dev/login` pour le login factice de dev). Il évite ainsi les problèmes de CORS et de certificat auto-signé. Le navigateur ne voit qu'une seule origine, ce qui permet d'utiliser le cookie de session de validator-api quand l'authentification est activée (voir *Authentification*). Le serveur se configure par variables d'environnement :

| Variable | Défaut | Description |
|----------|--------|-------------|
| `PORT` | `3000` | Port d'écoute |
| `VALIDATOR_API_URL` | `https://127.0.0.1:8001` | Origine de validator-api (cible du proxy) |
| `VALIDATOR_SPECS_URL` | `$VALIDATOR_API_URL/api/validator-api.yml` | URL de la spécification OpenAPI |

L'URL de l'API appelée par le navigateur est définie dans `public/index.html` (`/api`, relayée par `server.js`).

Exemple avec validator-api lancée par `symfony server:start` sur le port 8000 :

```bash
VALIDATOR_API_URL=https://127.0.0.1:8000 npm run start
```

## Authentification

Quand l'authentification OIDC est activée sur validator-api (`OIDC_ENABLED=true`), le client le détecte via `GET /api/me`. Il affiche alors :

* « Se connecter » / « Se déconnecter » dans la barre de navigation ;
* l'envoi d'une archive réservé aux utilisateurs connectés ;
* la suppression réservée au créateur et aux administrateurs (`can_edit`) ;
* la page « Administration » (`/admin`) pour les administrateurs.

Le client ne manipule aucun jeton : validator-api ouvre une session et le navigateur envoie le cookie. **Le client doit donc être servi sur la même origine que l'API**, directement par validator-api ou derrière un proxy comme `server.js`. La redirect URI correspondante doit être déclarée dans Keycloak (ex : `http://localhost:3000/login_check`).

Pour une nouvelle version, penser à **mettre à jour le numéro de version** dans le `package.json` et à reconstruire `dist/` (la CI vérifie qu'il est à jour) :

```bash
npm run build
```

## Usage

Ce démonstrateur est inclus dans [IGNF/validator-api](https://github.com/IGNF/validator-api). Si toutefois vous souhaitez déployer séparément l'API et le démonstrateur, suivez les instructions dans la fiche [intégration dans une application existante](docs/integration-application.md)

## Licence

Ce paquet est publié sous licence [AGPL-3.0-or-later](LICENSE). Lorsqu'il est intégré comme dépendance d'une application tierce (par exemple le backend d'IGNF/validator-api), la compatibilité de cette licence avec le mode de distribution de l'application hôte est à valider par les équipes concernées.
