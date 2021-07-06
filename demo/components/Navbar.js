import React from 'react';

import {
    Link
} from 'react-router-dom';

const Navbar = ({ routes }) => (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <Link className="navbar-brand" to="/">IGNF/demo-validator</Link>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto">
                {routes.map((route, index) => (
                    <li className="nav-item" key={index}>
                        <Link className="nav-link" to={route.path}>{route.nav}</Link>
                    </li>
                ))}
            </ul>
        </div>
    </nav>
)

export default Navbar;