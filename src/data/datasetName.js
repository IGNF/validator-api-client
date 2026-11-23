/*
 * Dataset name rules, same as validator-api (Validation::REGEXP_DATASET_NAME) : the name
 * of the uploaded file without its .zip extension is used in file paths by the API.
 */
export const REGEXP_DATASET_NAME = /^[A-Za-z0-9_][A-Za-z0-9_.-]{0,99}$/;

/**
 * Returns the dataset name corresponding to a file name ("PLU_2026.zip" => "PLU_2026").
 *
 * @param {string} filename
 * @returns {string}
 */
export function getDatasetName(filename) {
    return filename.replace(/\.zip$/i, '');
}

/**
 * Size in MB, as displayed to the user ("300 Mo").
 *
 * @param {number} size in bytes
 * @returns {string}
 */
export function formatSize(size) {
    return `${Math.round(size / (1024 * 1024))} Mo`;
}

/**
 * Returns an error message if the file is larger than the maximum size accepted by the API, null otherwise.
 *
 * @param {number} size in bytes
 * @param {number} maxSize in bytes
 * @returns {string|null}
 */
export function getFileSizeError(size, maxSize) {
    if (maxSize && size > maxSize) {
        return `Fichier trop volumineux (${formatSize(size)}) : la taille maximale acceptée est de ${formatSize(maxSize)}.`;
    }
    return null;
}

/**
 * Returns an error message if the file name can't be accepted by the API, null otherwise.
 *
 * @param {string} filename
 * @returns {string|null}
 */
export function getFilenameError(filename) {
    if (!REGEXP_DATASET_NAME.test(getDatasetName(filename))) {
        return 'Nom de fichier invalide : utilisez au plus 100 caractères parmi lettres sans accent, '
            + 'chiffres, "_", "-" et "." (sans espace), en commençant par une lettre, un chiffre ou "_".';
    }
    return null;
}
