# Intégration dans une application existante

* Créez un élément pour contenir le démonstrateur

```html
<div id="demo-wrapper"></div>
```

* Copiez le dossier `dist` et ajoutez le script `dist/validator-client.js`. Les autres fichiers de `dist` (swagger-ui, js-yaml) sont chargés à la demande depuis le même dossier.

* Copiez les dossiers `public/css`, `public/img` et `public/font`, et ajoutez la feuille de style :

```html
<link rel="stylesheet" href="css/style-carto.css">
```

* Instanciez l'application en configurant l'URL de l'API et de la documentation swagger :

```javascript
validator.setValidatorApiUrl("https://yourinstance/api");
validator.setValidatorSpecsUrl("https://yourinstance/api/validator-api.yml");
validator.createDemoApplication({
    targetElement: document.getElementById('demo-wrapper')
});
```

* Optionnel : pour des URLs sans `#` (ex : `/validation/xxx` au lieu de `/#/validation/xxx`), passez le chemin de base de l'application :

```javascript
validator.createDemoApplication({
    targetElement: document.getElementById('demo-wrapper'),
    basename: '/'
});
```

Le serveur doit alors renvoyer la page du démonstrateur pour toutes ses routes (`/about`, `/legal-notice`, `/api`, `/validation/{uid}`), et les chemins relatifs vers css/img doivent rester valides depuis ces routes (ex : `<base href="/">`). Les anciennes URLs en `#/...` sont redirigées automatiquement.

* Authentification : si validator-api a l'authentification OIDC activée, le démonstrateur affiche la connexion (voir `GET /api/me`). Il s'appuie sur le cookie de session de validator-api : la page doit être servie **sur la même origine que l'API** (ex : `https://yourinstance/` et `https://yourinstance/api`), éventuellement derrière un reverse proxy qui relaie aussi `/login`, `/login_check` et `/logout`.
