const React = require('react');
const ReactDOM = require('react-dom');

import Main from './components/Main';
import { BrowserRouter, Route, Switch } from 'react-router-dom';


const validator = {
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

