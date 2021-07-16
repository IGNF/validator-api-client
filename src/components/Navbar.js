import React from 'react';

import { Link } from 'react-router-dom';
import config from '../config';

const Navbar = () => (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <Link className="navbar-brand" to="/">IGNF/demo-validator</Link>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto">
                <li className="nav-item">
                    <Link className="nav-link" to="/">Accueil</Link>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href={config.validatorApiUrl+'/'}>API</a>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/about">A propos</Link>
                </li>
            </ul>
        </div>
    </nav>
)

export default Navbar;