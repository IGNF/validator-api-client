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


