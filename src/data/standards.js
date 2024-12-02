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

import dgprStandards from './dgpr-standard.json';
dgprStandards.forEach(function(standard){
    standard.plugins = 'DGPR';
    standard.defaultArguments = {
        'dgpr-tolerance': 10,
        'dgpr-simplify': 2,
        'dgpr-safe-simplify': true,
        'encoding': 'LATIN1'
    };
});

const standards = [
    ...dgprStandards,
    ...pcrsStandards,
    ...planPreventionRisqueStandards,
    ...naviforestStandards,
    ...gpuStandards
];
export default standards;
