import React, { useEffect, useState } from 'react';

import { Link, useLocation } from 'react-router-dom';

import { getLoginHref, useAuth } from './AuthContext';

import './Navbar.css';

//TODO: Définir le nom de l'application selon une variable d'environnement.

const MENU = [
    { to: '/', label: 'Accueil' },
    { to: '/api', label: "Documentation de l'API" },
    { to: '/about', label: 'A propos' }
];

/**
 * Liens du compte : validations / administration et connexion / déconnexion (si l'authentification est
 * activée sur l'API).
 *
 * @returns {{label: string, to?: string, href?: string, title?: string, highlight?: boolean}[]}
 */
function useAccountLinks() {
    const auth = useAuth();
    if (auth.loading || !auth.enabled) {
        return [];
    }
    if (!auth.authenticated) {
        return [{ label: 'Se connecter', href: getLoginHref(auth) }];
    }
    return [
        // the admins see all the validations (including theirs) in the administration
        auth.user.is_admin
            ? { label: 'Administration', to: '/admin', highlight: true }
            : { label: 'Mes validations', to: '/validations', highlight: true },
        { label: `Se déconnecter (${auth.user.name})`, href: auth.logoutUrl, title: auth.user.email || auth.user.name }
    ];
}

function NavLink({ link, className }) {
    return link.to
        ? <Link className={className} to={link.to}>{link.label}</Link>
        : <a className={className} href={link.href} title={link.title}>{link.label}</a>;
}

/**
 * Élément du menu, mis en évidence pour la page courante.
 */
function MenuItem({ link, pathname }) {
    const active = link.to === pathname;
    return (
        <li className={active ? 'nav-item is-active' : 'nav-item'}>
            <NavLink link={link} className="nav-link" />
        </li>
    );
}

const Navbar = () => {
    const { pathname } = useLocation();
    const accountLinks = useAccountLinks();
    const [mobileOpen, setMobileOpen] = useState(false);

    // the mobile menu is closed when navigating
    useEffect(() => {
        setMobileOpen(false);
    }, [pathname]);

    return (
        <header className={mobileOpen ? 'header header-principal nav-is-open' : 'header header-principal'} role="banner">
            <div className="header-principal--left">
                <nav className="navbar navbar--mobile p-0" role="navigation" aria-label="Menu principal (mobile)">
                    <button type="button" className="navbar-toggler" aria-controls="navbarMobile" aria-expanded={mobileOpen}
                        onClick={() => setMobileOpen(!mobileOpen)}>
                        <span className={mobileOpen ? 'icon-close navbar-toggler--icon' : 'icon-burger navbar-toggler--icon'} aria-hidden="true"></span>
                        <span className="sr-only">{mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}</span>
                    </button>
                    <div className="navbar-collapse" id="navbarMobile">
                        <ul className="navbar-nav">
                            {MENU.concat(accountLinks).map((link) => (
                                <MenuItem key={link.label} link={link} pathname={pathname} />
                            ))}
                        </ul>
                    </div>
                </nav>
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
                        {MENU.map((link) => (
                            <MenuItem key={link.label} link={link} pathname={pathname} />
                        ))}
                    </ul>
                </nav>
                {accountLinks.length > 0 && (
                    <div className="header-principal__account">
                        {accountLinks.map((link) => (
                            <NavLink key={link.label} link={link}
                                className={link.highlight ? 'btn btn-sm btn--plain btn--accent' : 'btn btn-sm btn--ghost btn--primary'} />
                        ))}
                    </div>
                )}
            </div>
        </header>
    );
};

export default Navbar;
