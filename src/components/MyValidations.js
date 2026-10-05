import React from 'react';
import { Link, Navigate } from 'react-router-dom';

import AccessRequired from './AccessRequired';
import { useAuth } from './AuthContext';
import Loading from './Loading';
import PageTitle from './PageTitle';
import ValidationsTable from './ValidationsTable';

/**
 * Validations créées par l'utilisateur connecté.
 */
function MyValidations() {
    const auth = useAuth();

    let content;
    if (auth.loading) {
        content = <Loading />;
    } else if (!auth.authenticated) {
        content = (
            <AccessRequired title="Connexion requise">
                Connectez-vous pour retrouver les validations que vous avez demandées.
            </AccessRequired>
        );
    } else if (auth.user.is_admin) {
        // the admins see all the validations in the administration
        return <Navigate to="/admin" replace />;
    } else {
        content = (
            <>
                <p>
                    <Link className="btn btn-sm btn--ghost btn--primary" to="/">Nouvelle validation</Link>
                </p>
                <ValidationsTable emptyMessage="Vous n'avez pas encore demandé de validation." />
            </>
        );
    }

    return (
        <main className="main" role="main" tabIndex="-1">
            <PageTitle title="Mes validations" />
            <div className="container-content">
                {content}
            </div>
        </main>
    );
}

export default MyValidations;
