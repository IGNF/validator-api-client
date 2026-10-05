import React from 'react';

import './UploadProgress.css';

/**
 * Avancement de la demande de validation : téléversement de l'archive (pourcentage), puis attente du serveur.
 *
 * @param {object} props
 * @param {string} props.label étape en cours
 * @param {?number} [props.percent] pourcentage, barre animée si absent
 */
function UploadProgress({ label, percent = null }) {
    const determinate = percent !== null;
    return (
        <div className="upload-progress" role="status" aria-live="polite">
            <div className="upload-progress__label">
                <span>{label}</span>
                {determinate && <strong>{percent} %</strong>}
            </div>
            <div className="upload-progress__track"
                role="progressbar" aria-label={label} aria-valuemin="0" aria-valuemax="100"
                aria-valuenow={determinate ? percent : undefined}>
                <div className={`upload-progress__bar${determinate ? '' : ' upload-progress__bar--indeterminate'}`}
                    style={determinate ? { width: `${percent}%` } : undefined}></div>
            </div>
        </div>
    );
}

export default UploadProgress;
