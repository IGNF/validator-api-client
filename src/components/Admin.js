import React from 'react';

import AccessRequired from './AccessRequired';
import { useAuth } from './AuthContext';
import Loading from './Loading';
import PageTitle from './PageTitle';
import ValidationsTable from './ValidationsTable';

/**
 * Liste de toutes les validations, réservée aux administrateurs.
 */
function Admin() {
    const auth = useAuth();

    let content;
    if (auth.loading) {
        content = <Loading />;
    } else if (!auth.authenticated || !auth.user.is_admin) {
        content = (
            <AccessRequired title="Accès réservé aux administrateurs">
                {auth.authenticated
                    ? "Votre compte n'a pas les droits d'administration."
                    : 'Connectez-vous avec un compte administrateur pour consulter toutes les validations.'}
            </AccessRequired>
        );
    } else {
        content = <ValidationsTable showOwner showModel />;
    }

    return (
        <main className="main" role="main" tabIndex="-1">
            <PageTitle title="Administration" />
            <div className="container-content">
                {content}
            </div>
        </main>
    );
}

export default Admin;
