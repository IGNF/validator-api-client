import { notifyUnauthorized } from './authEvents';

/**
 * Error message for an API response (message returned by the API, ex : invalid file name).
 *
 * @param {number} status
 * @param {?object} data JSON body of the response
 * @returns {string}
 */
export function getErrorMessage(status, data) {
    const message = data && data.message ? data.message : null;
    if (status === 401) {
        notifyUnauthorized();
        return 'Vous devez vous connecter pour effectuer cette action';
    }
    if (status === 403) {
        return `Action non autorisée${message ? ` (${message})` : ''}`;
    }
    return message || `Erreur HTTP ${status}`;
}

/**
 * Returns the JSON body of an API response, throwing an Error with the message
 * returned by the API (ex : invalid file name) if the response is not successful.
 *
 * @param {Response} response
 * @returns {Promise<object>}
 */
async function readJsonResponse(response) {
    let data = null;
    try {
        data = await response.json();
    } catch (e) {
        // body is not JSON (ex : proxy error page)
    }
    if (!response.ok) {
        throw new Error(getErrorMessage(response.status, data));
    }
    return data;
}

export default readJsonResponse;
