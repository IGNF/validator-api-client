import React from 'react';

import { Extent } from './DocumentInfo';
import StatusBadge from './StatusBadge';
import ValidationActions from './ValidationActions';

// zip pre-validation errors (file, code, message) have no level : they are errors
const levelOf = (result) => result.level || 'ERROR';

/**
 * Résultat de la validation : valide (avec ou sans avertissements), non valide ou erreur du validateur
 */
export function ValidationResult({ validation }) {
    if (validation.status === 'error') {
        return (
            <span className="badge badge-danger">
                <span className="icon-close" aria-hidden="true"></span>
                Erreur
            </span>
        );
    }
    if (validation.status !== 'finished' || !Array.isArray(validation.results)) {
        return null;
    }
    const levels = validation.results.map(levelOf);
    if (levels.includes('ERROR')) {
        return <span className="badge badge-danger">Non valide</span>;
    }
    if (levels.includes('WARNING')) {
        return <span className="badge badge-warning">Valide avec avertissements</span>;
    }
    return <span className="badge badge-success">Valide</span>;
}

/**
 * Affichage du statut, des informations générales et des actions sur la validation
 */
function ValidationProperties({ validation }) {
    const args = validation.arguments || {};
    const documentInfo = validation.document_info;
    const modelName = documentInfo && documentInfo.documentModel && documentInfo.documentModel.name;
    const extent = documentInfo && documentInfo.documentExtent;

    return (
        <table className="table table-striped">
            <tbody>
                <tr>
                    <td className="col-2 font-weight-bold">Statut</td>
                    <td className="text-left">
                        <StatusBadge status={validation.status} /> <ValidationResult validation={validation} />
                    </td>
                </tr>
                {args.model && (
                    <tr>
                        <td>Modèle</td>
                        <td>
                            <a className="external-link"
                                target="_blank"
                                rel="noopener noreferrer"
                                href={args.model}>
                                {modelName || args.model}
                                <span className="icon-external-link" aria-hidden="true"></span>
                            </a>
                        </td>
                    </tr>
                )}
                <tr>
                    <td>Projection</td>
                    <td>{args.srs}</td>
                </tr>
                {extent && (
                    <tr>
                        <td>Emprise</td>
                        <td><Extent boundingBox={extent} /></td>
                    </tr>
                )}
                <ValidationActions validation={validation} />
            </tbody>
        </table>
    );
}

export default ValidationProperties;
