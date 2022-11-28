import expStandards from './pcrs-standard.json';
expStandards.forEach(function(standard){
    standard.plugins = 'PCRS';
});

import gpuStandards from './gpu-standards.json';
gpuStandards.forEach(function(standard){
    standard.plugins = 'CNIG';
});

const standards = [...expStandards,...gpuStandards];
export default standards;
