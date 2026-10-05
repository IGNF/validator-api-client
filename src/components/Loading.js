import React from 'react';

/**
 * Chargement en cours (même rendu que la page d'attente de validator-api).
 */
function Loading() {
    return (
        <p className="text-center my-5" role="status">
            <span className="icon-timer" aria-hidden="true"></span><br />
            Chargement...
        </p>
    );
}

export default Loading;
