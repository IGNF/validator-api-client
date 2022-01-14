# IGNF/validator-api-client

[![License: AGPL-3.0](https://img.shields.io/badge/License-AGPL--3.0-blue.svg)](LICENSE)
## Description

Démonstrateur pour appel à l'API [IGNF/validator-api](https://github.com/IGNF/validator-api).

> :warning: ce démonstrateur contient des éléments éditoriaux et une charte graphique propres à l'IGN. Il vous appartient de surcharger ces éléments si vous envisagez un déploiement public.

## Fonctionnalités

* Lancer une validation sur une archive ZIP en choisissant un standard
* Visualiser le résultat d'une validation en connaissant son identifiant

## Développement

```bash
npm install
# build en continu du front
npm run watch
# lancement du back
npm run start
```

## Usage

Ce démonstrateur est inclus dans [IGNF/validator-api](https://github.com/IGNF/validator-api). Si toutefois vous souhaitez déployer séparément l'API et le démonstrateur, suivez les instructions ci-dessous.

Créez un élément pour contenir le démonstrateur

```html
<div id="demo-wrapper"></div>
```

Ajoutez le script `dist/validator-client.js` (disponible directement dans les releases)

Puis instanciés le `validator` en le configurant avec les URL de votre déploiement de l'API et de sa documentation swagger.

```javascript
validator.setValidatorApiUrl("https://yourinstance/api");
validator.setValidatorSpecsUrl("https://yourinstance/api/validator-api.yml");
validator.createDemoApplication({
    targetElement: document.getElementById('demo-wrapper');
});
```
