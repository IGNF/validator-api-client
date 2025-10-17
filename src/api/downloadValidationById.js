import config from '../config';

async function downloadValidationById(uid){
    console.log(`Get data for validation ${uid} ...`);
    const url = `${config.validatorApiUrl}/validation/${uid}/results.csv`;
    let response = await fetch(url,{
        method: 'GET'
    });
    let data = await response.blob();
    if ( response.status != 200 ){
        throw data;
    }
    return data;
}

export default downloadValidationById;
