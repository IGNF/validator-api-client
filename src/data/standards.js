import pcrsStandards from './pcrs-standard.json';
pcrsStandards.forEach(function (standard) {
    standard.plugins = 'PCRS';
});

import gpuStandards from './gpu-standards.json';
gpuStandards.forEach(function (standard) {
    standard.plugins = 'CNIG';
});

import naviforestStandards from './naviforest-standards.json';

import planPreventionRisqueStandards from './ppr-standards.json';
planPreventionRisqueStandards.forEach(function (standard) {
    if (standard.name == "Canalisations") {
        standard.defaultArguments = { 'delete-data': true };
    }
})

import dgprStandards from './dgpr-standard.json';
dgprStandards.forEach(function (standard) {
    standard.plugins = 'DGPR';
    standard.defaultArguments = {
        'dgpr-tolerance': 10,
        'dgpr-simplify': 2,
        'dgpr-safe-simplify': true,
        'encoding': 'LATIN1'
    };
});

/*
 * GPU document types (from the standard name, e.g. "cnig_PLUi_2017"), in display order.
 */
const gpuDocumentTypes = [
    { type: 'PLU', label: 'Plan local d\'urbanisme' },
    { type: 'PLUi', label: 'Plan local d\'urbanisme intercommunal' },
    { type: 'POS', label: 'Plan d\'occupation des sols' },
    { type: 'CC', label: 'Carte communale' },
    { type: 'PSMV', label: 'Plan de sauvegarde et de mise en valeur' },
    { type: 'SCoT', label: 'Schéma de cohérence territoriale' },
    { type: 'SUP', label: 'Servitudes d\'utilité publique' }
];

const byNaturalName = (a, b) => a.name.localeCompare(b.name, undefined, { numeric: true });

const gpuCategories = gpuDocumentTypes.map(function ({ type, label }) {
    return {
        label: `GPU - ${type} - ${label}`,
        standards: gpuStandards
            .filter((standard) => standard.name.split('_')[1] === type)
            .sort(byNaturalName)
    };
});

/*
 * Categories displayed as groups in the standard drop-down (in display order).
 */
const categories = [
    { label: 'PPR - Plans de prévention des risques', standards: planPreventionRisqueStandards },
    { label: 'DGPR - Directive inondation', standards: dgprStandards },
    { label: 'PCRS - Plan corps de rue simplifié', standards: pcrsStandards },
    { label: 'Naviforest', standards: naviforestStandards },
    ...gpuCategories
];

const standards = categories.flatMap(function (category) {
    return category.standards.map(function (standard) {
        return { ...standard, category: category.label };
    });
});
export default standards;
