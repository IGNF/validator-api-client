import config from '../config';

async function getValidationById(uid){
    const url = `${config.validatorApiUrl}/validations/${uid}`;
    let response = await fetch(url);
    let data = await response.json();
    if ( response.status != 200 ){
        throw data;
    }
    return data;
}

export default getValidationById;
