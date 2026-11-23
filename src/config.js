/**
 * Default DEV values to use with "symfony server:start" in validator-api
 */
const config = {
    validatorApiUrl: 'http://localhost:8000/api',
    // Proxied by server.js in the demo client (avoids CORS), same path as validator-api
    validatorSpecsUrl: '/api/validator-api.yml',
    // Maximum size of the uploaded file in bytes, same as validator-api
    // (upload_max_filesize / post_max_size in .docker/php.ini, ingress proxy-body-size)
    maxUploadSize: 300 * 1024 * 1024
}

export default config;

