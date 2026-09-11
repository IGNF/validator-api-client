/**
 * Default DEV values to use with "symfony server:start" in validator-api
 */
const config = {
    validatorApiUrl: 'http://localhost:8000/api',
    // Use local proxy to avoid CORS in the demo client
    validatorSpecsUrl: '/proxy/spec'
}

export default config;

