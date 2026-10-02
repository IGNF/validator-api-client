import config from '../config';

const NO_DOWNLOAD = { source: false, normalized: false };

let cache = null;

/**
 * A route is enabled if it is documented and not flagged with "x-disabled".
 */
function isEnabled(pathItem) {
    return Boolean(pathItem && pathItem.get && !pathItem.get['x-disabled']);
}

/**
 * Returns which data downloads are enabled by the API.
 *
 * validator-api flags the download routes with "x-disabled" in its OpenAPI specification
 * when DATA_DOWNLOAD_ENABLED is off (they then answer 403). Older versions removed them
 * from the specification. Downloads are considered disabled if it can't be read.
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
            .then((text) => import(/* webpackChunkName: "js-yaml" */ 'js-yaml').then(({ load }) => load(text)))
            .then((specs) => {
                const paths = specs.paths || {};
                return {
                    source: isEnabled(paths['/api/validations/{uid}/files/source']),
                    normalized: isEnabled(paths['/api/validations/{uid}/files/normalized']),
                };
            })
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
