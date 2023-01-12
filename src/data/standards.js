import expStandards from './pcrs-standard.json';
expStandards.forEach(function(standard){
    standard.plugins = 'PCRS';
});

import gpuStandards from './gpu-standards.json';
gpuStandards.forEach(function(standard){
    standard.plugins = 'CNIG';
});

import expressStandards from './express-standards.json';

const standards = [
    ...expStandards,
    ...expressStandards, 
    ...gpuStandards
];
export default standards;
