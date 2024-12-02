import React from 'react';

import { Link } from 'react-router-dom';
import config from '../config';

const Navbar = () => (
    <header className="header header-principal" role="banner">
        <div className="header-principal--left">
            <div className="header-principal__logo">
                <Link className="header-principal__logo-link" title="Validateur TRI" to="/">
                    <img src="img/logo_IGN.png" alt="Logo IGN"/>
                    <span className="header-principal__name">Validateur TRI</span>
                </Link>
            </div>
        </div>
        <div className="header-principal--right">
            <nav className="navbar--desktop" role="navigation" aria-label="Menu principal">
                <ul className="navbar-nav navbar-nav--portails">
                    <li className="nav-item">
                        <Link className="nav-link" to="/">Accueil</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/api">Documentation de l'API</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/about">A propos</Link>
                    </li>
                </ul>
            </nav>
        </div>
    </header>
)

export default Navbar;