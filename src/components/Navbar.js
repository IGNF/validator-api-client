import React from 'react';

import { Link } from 'react-router-dom';

import { getLoginHref, useAuth } from './AuthContext';

//TODO: Définir le nom de l'application selon une variable d'environnement.

/**
 * Connexion / déconnexion (si l'authentification est activée sur l'API).
 */
function AuthNavItems() {
    const auth = useAuth();
    if (auth.loading || !auth.enabled) {
        return null;
    }
    if (!auth.authenticated) {
        return (
            <li className="nav-item">
                <a className="nav-link" href={getLoginHref(auth)}>Se connecter</a>
            </li>
        );
    }
    return (
        <>
            {/* the admins see all the validations (including theirs) in the administration */}
            {auth.user.is_admin ? (
                <li className="nav-item">
                    <Link className="nav-link" to="/admin">Administration</Link>
                </li>
            ) : (
                <li className="nav-item">
                    <Link className="nav-link" to="/validations">Mes validations</Link>
                </li>
            )}
            <li className="nav-item">
                <a className="nav-link" href={auth.logoutUrl} title={auth.user.email || auth.user.name}>
                    Se déconnecter ({auth.user.name})
                </a>
            </li>
        </>
    );
}

const Navbar = () => (
    <header className="header header-principal" role="banner">
        <div className="header-principal--left">
            <div className="header-principal__logo">
                <Link className="header-principal__logo-link" title="Validateur" to="/">
                    <img src="img/logo_IGN.png" alt="Logo IGN" />
                    <span className="header-principal__name">Validateur</span>
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
                    <AuthNavItems />
                </ul>
            </nav>
        </div>
    </header>
)

export default Navbar;
