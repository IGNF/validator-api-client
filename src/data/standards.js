import pcrsStandards from './pcrs-standard.json';
pcrsStandards.forEach(function(standard){
    standard.plugins = 'PCRS';
});

import gpuStandards from './gpu-standards.json';
gpuStandards.forEach(function(standard){
    standard.plugins = 'CNIG';
});

import naviforestStandards from './naviforest-standards.json';

import planPreventionRisqueStandards from './ppr-standards.json';

const standards = [
    ...planPreventionRisqueStandards,
    ...pcrsStandards,
    ...naviforestStandards,
    ...gpuStandards
];
export default standards;
