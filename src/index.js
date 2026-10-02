const React = require('react');
const { createRoot } = require('react-dom/client');

import Main from './components/Main';

/**
 * Global configuration
 */
import config from './config';

const validator = {

    /**
     * @param {string} validatorApiUrl
     */
    setValidatorApiUrl(validatorApiUrl) {
        config.validatorApiUrl = validatorApiUrl;
    },

    getValidatorApiUrl() {
        return config.validatorApiUrl;
    },

    /**
    * @param {string} validatorSpecsUrl
    */
    setValidatorSpecsUrl(validatorSpecsUrl) {
        config.validatorSpecsUrl = validatorSpecsUrl;
    },

    /**
     * Create full react application.
     * @param {object} options
     * @param {HTMLElement} options.targetElement
     * @param {string} [options.basename] base path of the application (ex : "/") to use URLs
     *   without "#". The server must then return the page for every application route.
     */
    createDemoApplication: function (options) {
        options.targetElement = options.targetElement || document.getElementById('main');

        const basename = options.basename;
        if (basename && window.location.hash.startsWith('#/')) {
            // Redirect legacy hash URLs (ex : "/#/validation/xxx" -> "/validation/xxx")
            const path = basename.replace(/\/$/, '') + window.location.hash.substring(1);
            window.history.replaceState(null, '', path);
        }

        createRoot(options.targetElement).render(<Main basename={basename} />);
    }
};


window.validator = validator;

