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
        const message = data && data.message ? data.message : `Erreur HTTP ${response.status}`;
        throw new Error(message);
    }
    return data;
}

export default readJsonResponse;
