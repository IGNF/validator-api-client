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

    test('SUP standards are grouped by servitude family', () => {
        const categoryOf = (name) => standards.find((standard) => standard.name === name).category;
        expect(categoryOf('cnig_SUP_A1_2013')).toMatch(/^GPU - SUP_A - /);
        expect(categoryOf('cnig_SUP_AC4bis_2016')).toMatch(/^GPU - SUP_AC - /);
        expect(categoryOf('cnig_SUP_EL10_2013')).toMatch(/^GPU - SUP_EL - /);
        expect(categoryOf('cnig_SUP_INT1_2016')).toMatch(/^GPU - SUP_INT - /);
    });

    test('GPU standards are naturally sorted within their category', () => {
        const sup = standards.filter((standard) => standard.category.startsWith('GPU - SUP_A - '));
        const names = sup.map((standard) => standard.name);
        expect(names.indexOf('cnig_SUP_A2_2013')).toBeLessThan(names.indexOf('cnig_SUP_A10_2016'));
    });
});
