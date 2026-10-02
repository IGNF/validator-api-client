# Intégration dans une application existante

* Créez un élément pour contenir le démonstrateur

```html
<div id="demo-wrapper"></div>
```

* Ajoutez le script `dist/validator-client.js` (disponible directement dans les releases)

* Instanciez l'application en configurant l'URL de l'API et de la documentation swagger :

```javascript
validator.setValidatorApiUrl("https://yourinstance/api");
validator.setValidatorSpecsUrl("https://yourinstance/api/validator-api.yml");
validator.createDemoApplication({
    targetElement: document.getElementById('demo-wrapper');
});
```

* Pensez à copier également les dossiers css, img et font.

* Optionnel : pour des URLs sans `#` (ex : `/validation/xxx` au lieu de `/#/validation/xxx`), passez le chemin de base de l'application :

```javascript
validator.createDemoApplication({
    targetElement: document.getElementById('demo-wrapper'),
    basename: '/'
});
```

Le serveur doit alors renvoyer la page du démonstrateur pour toutes ses routes (`/about`, `/legal-notice`, `/api`, `/validation/{uid}`), et les chemins relatifs vers css/img doivent rester valides depuis ces routes (ex : `<base href="/">`). Les anciennes URLs en `#/...` sont redirigées automatiquement.


