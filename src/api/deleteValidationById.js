import config from '../config';

/**
 * Deletes a validation, throwing an Error with the message returned by the API
 * (ex : 409 if the validation is being processed).
 */
async function deleteValidationById(uid){
    console.log(`Delete validation ${uid} ...`);
    const url = `${config.validatorApiUrl}/validations/${uid}`;
    let response = await fetch(url,{
        method: 'DELETE'
    });
    let data = await response.text();
    if ( response.status != 204 ){
        let message = `Erreur HTTP ${response.status}`;
        try {
            message = JSON.parse(data).message || message;
        } catch (e) {
            // body is not JSON
        }
        throw new Error(message);
    }
    return data;
}

export default deleteValidationById;
