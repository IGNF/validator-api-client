import 'core-js/stable';
import 'regenerator-runtime/runtime';
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
     */
    createDemoApplication: function (options) {
        options.targetElement = options.targetElement || document.getElementById('main');

        createRoot(options.targetElement).render(<Main />);
    }
};


window.validator = validator;

