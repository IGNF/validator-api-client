import config from '../config';

const NO_DOWNLOAD = { source: false, normalized: false };

let cache = null;

/**
 * Returns which data downloads are enabled by the API.
 *
 * validator-api removes the download routes from its OpenAPI specification when
 * DATA_DOWNLOAD_ENABLED is off (they then answer 403), so their presence in the
 * specification is checked. Downloads are considered disabled if it can't be read.
 *
 * @returns {Promise<{source: boolean, normalized: boolean}>}
 */
function getAvailableDownloads() {
    if (cache === null) {
        cache = fetch(config.validatorSpecsUrl)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }
                return response.text();
            })
            .then((specs) => ({
                source: specs.includes('/files/source'),
                normalized: specs.includes('/files/normalized'),
            }))
            .catch((error) => {
                console.log('Fail to read API specification, downloads are disabled', error);
                return NO_DOWNLOAD;
            });
    }
    return cache;
}

/**
 * Forget the cached result (tests).
 */
export function resetAvailableDownloads() {
    cache = null;
}

export default getAvailableDownloads;
