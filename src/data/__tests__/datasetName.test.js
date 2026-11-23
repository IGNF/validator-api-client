import { formatSize, getDatasetName, getFileSizeError, getFilenameError } from '../datasetName';

describe('datasetName', () => {
    it('removes the .zip extension whatever its case', () => {
        expect(getDatasetName('PLU_2026.zip')).toEqual('PLU_2026');
        expect(getDatasetName('PLU_2026.v2.ZIP')).toEqual('PLU_2026.v2');
    });

    it.each([
        '130010853_PM3_60_20180516.zip',
        'PLU_2026.v2.ZIP',
        '_test-1.zip',
    ])('accepts "%s"', (filename) => {
        expect(getFilenameError(filename)).toBeNull();
    });

    it.each([
        '...zip',
        '..zip',
        '.zip',
        '-r.zip',
        'my dataset.zip',
        'données.zip',
        `${'a'.repeat(101)}.zip`,
    ])('rejects "%s" as validator-api does', (filename) => {
        expect(getFilenameError(filename)).toMatch(/^Nom de fichier invalide/);
    });
});

describe('getFileSizeError', () => {
    const MB = 1024 * 1024;

    it('accepts a file up to the maximum size', () => {
        expect(getFileSizeError(300 * MB, 300 * MB)).toBeNull();
    });

    it('rejects a file larger than the maximum size', () => {
        expect(getFileSizeError(512 * MB, 300 * MB)).toBe(
            'Fichier trop volumineux (512 Mo) : la taille maximale acceptée est de 300 Mo.'
        );
    });

    it('accepts any size without maximum', () => {
        expect(getFileSizeError(512 * MB, null)).toBeNull();
    });

    it('formats the size in MB', () => {
        expect(formatSize(300 * MB)).toBe('300 Mo');
    });
});
