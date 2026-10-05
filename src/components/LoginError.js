import React, { useState } from 'react';

/**
 * Message displayed when the OIDC login failed (validator-api redirects to "/?login_error=1").
 */
function LoginError() {
    const [visible, setVisible] = useState(() => {
        const params = new URLSearchParams(window.location.search);
        if (!params.has('login_error')) {
            return false;
        }
        // not displayed again on reload
        params.delete('login_error');
        const search = params.toString();
        window.history.replaceState(window.history.state, '', window.location.pathname + (search ? `?${search}` : '') + window.location.hash);
        return true;
    });

    if (!visible) {
        return null;
    }
    return (
        <div className="container-content pt-3">
            <div className="alert alert-danger alert-dismissible" role="alert">
                La connexion a échoué. Veuillez réessayer.
                <button type="button" className="close" aria-label="Fermer" onClick={() => setVisible(false)}>
                    <span className="icon-close" aria-hidden="true"></span>
                </button>
            </div>
        </div>
    );
}

export default LoginError;
