import config from '../config';
import { getErrorMessage } from './readJsonResponse';

/**
 * Deletes a validation, throwing an Error with the message returned by the API
 * (ex : 409 if the validation is being processed).
 */
async function deleteValidationById(uid){
    const url = `${config.validatorApiUrl}/validations/${uid}`;
    let response = await fetch(url,{
        method: 'DELETE'
    });
    let data = await response.text();
    if ( response.status != 204 ){
        let json = null;
        try {
            json = JSON.parse(data);
        } catch (e) {
            // body is not JSON
        }
        throw new Error(getErrorMessage(response.status, json));
    }
    return data;
}

export default deleteValidationById;
