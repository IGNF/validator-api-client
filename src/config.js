/**
 * Default DEV values to use with "symfony server:start" in validator-api
 */
const config = {
    validatorApiUrl: 'http://localhost:8000/api',
    // Proxied by server.js in the demo client (avoids CORS), same path as validator-api
    validatorSpecsUrl: '/api/validator-api.yml'
}

export default config;

