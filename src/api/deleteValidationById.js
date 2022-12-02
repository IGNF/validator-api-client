import config from '../config';

async function deleteValidationById(uid){
    console.log(`Get data for validation ${uid} ...`);
    const url = `${config.validatorApiUrl}/validations/${uid}`;
    let response = await fetch(url,{
        method: 'DELETE'
    });
    let data = await response.text();
    if ( response.status != 204 ){
        throw data;
    }
    return data;
}

export default deleteValidationById;
