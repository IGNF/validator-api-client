import pcrsStandards from './pcrs-standard.json';
pcrsStandards.forEach(function(standard){
    standard.plugins = 'PCRS';
});

import gpuStandards from './gpu-standards.json';
gpuStandards.forEach(function(standard){
    standard.plugins = 'CNIG';
});

import naviforestStandards from './naviforest-standards.json';

const standards = [
    ...pcrsStandards,
    ...naviforestStandards,
    ...gpuStandards
];
export default standards;
