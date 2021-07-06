# demo-validator

## Description

Démonstrateur **minimal** pour appel à [IGNF/validator](https://github.com/IGNF/validator).

## Fonctionnalités

* [ ] Lancer une validation sur une archive ZIP en choisissant un standard
* [ ] Visualiser le résultat d'une validation en connaissant son identifiant

## Développement

```bash
npm install
# build en continu du front
npm run watch
# lancement du back
npm run start
```

## Remarques

* On veille à bien séparer le front du back pour permettre une intégration dans [IGNF/validator-api](https://github.com/IGNF/validator-api)
* On se permet au besoin temporairement une API équivalente minimaliste (**pas de BDD, dossiers et stack de traitement côté NodeJS/express**)
* On ne permet pas la récupération de la liste des validations
