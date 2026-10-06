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

import canalisationsStandards from './canalisations-standards.json';
canalisationsStandards.forEach(function (standard) {
    standard.defaultArguments = { 'delete-data': true };
});

import dgprStandards from './dgpr-standard.json';
dgprStandards.forEach(function (standard) {
    standard.plugins = 'DGPR';
    standard.defaultArguments = {
        'dgpr-tolerance': 10,
        'dgpr-simplify': 2,
        'dgpr-safe-simplify': true,
        // inclusion and graph topology controls disabled (validator-cli.jar >= 4.6.2)
        'dgpr-skip-inclusion': true,
        'dgpr-skip-graph-topology': true,
        'encoding': 'LATIN1'
    };
});

/*
 * GPU document types (from the standard name, e.g. "cnig_PLUi_2017", "GPU_MEC_2025"), in display order.
 */
const gpuDocumentTypes = [
    { type: 'PLU', label: 'Plan local d\'urbanisme' },
    { type: 'PLUi', label: 'Plan local d\'urbanisme intercommunal' },
    { type: 'POS', label: 'Plan d\'occupation des sols' },
    { type: 'CC', label: 'Carte communale' },
    { type: 'PSMV', label: 'Plan de sauvegarde et de mise en valeur' },
    { type: 'SCoT', label: 'Schéma de cohérence territoriale' },
    { type: 'MEC', label: 'Mise en compatibilité' },
    { type: 'SUP', label: 'Servitudes d\'utilité publique' }
];

const byNaturalName = (a, b) => a.name.localeCompare(b.name, undefined, { numeric: true });

/*
 * SUP family from the servitude code (e.g. "cnig_SUP_AC4bis_2016" -> "AC", "cnig_SUP_EL10_2013" -> "EL").
 */
const supFamily = (standard) => standard.name.split('_')[2].match(/^[A-Z]+/i)[0];

const gpuCategories = gpuDocumentTypes.flatMap(function ({ type, label }) {
    const typeStandards = gpuStandards
        .filter((standard) => standard.name.split('_')[1] === type)
        .sort(byNaturalName);

    if (type !== 'SUP') {
        return [{ label: `GPU - ${type} - ${label}`, standards: typeStandards }];
    }

    // SUP are numerous: one group per servitude family (SUP_A, SUP_AC, SUP_EL...)
    const families = [...new Set(typeStandards.map(supFamily))].sort();
    return families.map((family) => ({
        label: `GPU - SUP_${family} - ${label}`,
        standards: typeStandards.filter((standard) => supFamily(standard) === family)
    }));
});

/*
 * Categories displayed as groups in the standard drop-down (in display order).
 */
const categories = [
    { label: 'PPR - Plans de prévention des risques', standards: planPreventionRisqueStandards },
    { label: 'Canalisations', standards: canalisationsStandards },
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
