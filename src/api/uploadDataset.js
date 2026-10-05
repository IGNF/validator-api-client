import config from '../config';

/**
 * Uploads a dataset (POST /api/validations/), with the upload progress
 * (XMLHttpRequest : fetch doesn't report the upload progress).
 *
 * @param {File} file
 * @param {function(number):void} [onProgress] percentage of the file sent (0 to 100)
 * @returns {Promise<{ok: boolean, status: number, json: function(): Promise<object>}>} response compatible with readJsonResponse
 */
function uploadDataset(file, onProgress) {
    return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append('dataset', file);

        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${config.validatorApiUrl}/validations/`);
        if (onProgress) {
            xhr.upload.addEventListener('progress', (event) => {
                if (event.lengthComputable) {
                    onProgress(Math.round(100 * event.loaded / event.total));
                }
            });
        }
        xhr.addEventListener('load', () => {
            const body = xhr.responseText;
            resolve({
                ok: xhr.status >= 200 && xhr.status < 300,
                status: xhr.status,
                json: () => Promise.resolve().then(() => JSON.parse(body))
            });
        });
        xhr.addEventListener('error', () => reject(new Error('Erreur réseau')));
        xhr.addEventListener('abort', () => reject(new Error('Envoi annulé')));
        xhr.send(formData);
    });
}

export default uploadDataset;
