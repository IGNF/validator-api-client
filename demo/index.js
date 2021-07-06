const React = require('react');
const ReactDOM = require('react-dom');

import Main from './components/Main';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

ReactDOM.render(
    <BrowserRouter>
        <Main />
    </BrowserRouter>,
    document.getElementById('main')
);
