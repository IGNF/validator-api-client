const React = require('react');
const ReactDOM = require('react-dom');

import Main from './components/Main';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

/**
     * Global configuration
     */
import config from './config';

const validator = {

    /**
     * @param {string} validatorApiUrl
     */
    setValidatorApiUrl(validatorApiUrl){
        config.validatorApiUrl = validatorApiUrl;
    },

    getValidatorApiUrl() {
        return config.validatorApiUrl;
    },

     /**
     * @param {string} validatorSpecsUrl
     */
    setValidatorSpecsUrl(validatorSpecsUrl){
        config.validatorSpecsUrl = validatorSpecsUrl;
    },

    /**
     * Create full react application.
     * @param {object} options
     * @param {HTMLElement} options.targetElement
     */
    createDemoApplication: function(options){
        options.targetElement = options.targetElement || document.getElementById('main');

        ReactDOM.render(
            <BrowserRouter>
                <Main />
            </BrowserRouter>,
            options.targetElement
        );
    }
};


window.validator = validator;

