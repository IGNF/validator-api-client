import React from 'react';

import { getLoginHref, useAuth } from './AuthContext';

import './AccessRequired.css';

/**
 * Accès refusé : invite à se connecter (utilisateur anonyme) ou indique le droit manquant.
 *
 * @param {object} props
 * @param {string} props.title
 * @param {React.ReactNode} [props.children] explication
 * @param {React.ReactNode} [props.note] précision affichée sous le bouton
 */
function AccessRequired({ title, children, note }) {
    const auth = useAuth();
    return (
        <section className="access-required">
            <span className="access-required__icon" aria-hidden="true">
                <span className="icon-user"></span>
            </span>
            <h2 className="access-required__title h4">{title}</h2>
            {children && <p className="access-required__message">{children}</p>}
            {auth.enabled && !auth.authenticated && (
                <a className="btn btn--plain btn--primary btn-width--lg" href={getLoginHref(auth)}>Se connecter</a>
            )}
            {note && <p className="access-required__note">{note}</p>}
        </section>
    );
}

export default AccessRequired;
