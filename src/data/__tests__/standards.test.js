import standards from '../standards';
import gpuStandards from '../gpu-standards.json';

describe('standards', () => {
    test('every standard has a category', () => {
        standards.forEach((standard) => {
            expect(standard.category).toBeTruthy();
        });
    });

    test('every GPU standard is assigned to a document type category', () => {
        const gpuNames = standards
            .filter((standard) => standard.category.startsWith('GPU - '))
            .map((standard) => standard.name);
        expect(gpuNames.sort()).toEqual(gpuStandards.map((standard) => standard.name).sort());
    });

    test('GPU standards are naturally sorted within their category', () => {
        const sup = standards.filter((standard) => standard.category.startsWith('GPU - SUP'));
        const names = sup.map((standard) => standard.name);
        expect(names.indexOf('cnig_SUP_A2_2013')).toBeLessThan(names.indexOf('cnig_SUP_A10_2016'));
    });
});
