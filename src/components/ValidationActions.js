import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import config from '../config';

import deleteValidationById from '../api/deleteValidationById';
import getAvailableDownloads from '../api/getAvailableDownloads';

import { useAuth } from './AuthContext';

import "./ValidationActions.css";

/**
 * Lien stylé en bouton, avec icône
 */
function ActionLink({ href, icon, external, download, children }) {
    const target = external ? { target: '_blank', rel: 'noopener noreferrer' } : {};
    return (
        <a className="btn btn-sm btn--ghost btn--primary" href={href} download={download} {...target}>
            <span className={`icon-${icon}`} aria-hidden="true"></span>
            {children}
        </a>
    );
}

/**
 * Ligne "Actions" du tableau des propriétés de la validation
 */
function ValidationActions({ validation }) {
    const navigate = useNavigate();
    const auth = useAuth();
    // source and normalized data downloads can be disabled by the API
    const [downloads, setDownloads] = useState({ source: false, normalized: false });
    const [deleteError, setDeleteError] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const finished = validation.status === 'finished';

    // data downloads are only offered for finished validations
    useEffect(() => {
        if (!finished) {
            return;
        }
        let cancelled = false;
        getAvailableDownloads().then((available) => {
            if (!cancelled) {
                setDownloads(available);
            }
        });
        return () => {
            cancelled = true;
        };
    }, [finished]);

    const uid = validation.uid;
    // only the owner and the admins can delete the validation and download its data (can_edit is missing with older APIs)
    const canEdit = validation.can_edit !== false;
    // validator logs : admins only when the authentication is enabled
    const canReadLogs = !auth.enabled || (auth.authenticated && auth.user.is_admin);
    const hasLogs = (finished || validation.status === 'error') && canReadLogs;
    // a validation can't be deleted while it is processed (409)
    const canDelete = canEdit && validation.status !== 'processing';
    // document-info.json is only produced with the "normalize" option
    const documentInfo = validation.document_info;

    if (!finished && !hasLogs && !canDelete && !documentInfo) {
        return null;
    }
    const baseUrl = `${config.validatorApiUrl}/validations/${uid}`;

    function onClickDelete() {
        if (!window.confirm('Confirmer la suppression?')) {
            return;
        }
        setDeleting(true);
        setDeleteError(null);
        deleteValidationById(uid).then(() => {
            navigate('/');
        }).catch((error) => {
            console.error(error);
            setDeleteError(error.message || 'La suppression a échoué');
            setDeleting(false);
        });
    }

    return (
        <tr>
            <td className="col-2">Actions</td>
            <td>
                <div className="validation-actions">
                    {finished && (
                        <>
                            <ActionLink href={`${baseUrl}/results.csv`} icon="download">Rapport CSV</ActionLink>
                            <ActionLink href={`${baseUrl}/report?print=1`} icon="download" external>Rapport PDF</ActionLink>
                        </>
                    )}
                    {finished && canEdit && downloads.source && (
                        <ActionLink href={`${baseUrl}/files/source`} icon="download">Fichiers sources</ActionLink>
                    )}
                    {finished && canEdit && downloads.normalized && (
                        <ActionLink href={`${baseUrl}/files/normalized`} icon="download">Fichiers normalisés</ActionLink>
                    )}
                    {documentInfo && (
                        <ActionLink href={'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(documentInfo, null, 2))}
                            icon="download" download="document-info.json">document-info.json</ActionLink>
                    )}
                    {hasLogs && (
                        <ActionLink href={`${baseUrl}/logs`} icon="external-link" external>Logs du validateur</ActionLink>
                    )}

                    {canDelete && (
                        <button type="button" className="btn btn-sm btn--ghost btn--danger validation-actions__delete"
                            onClick={onClickDelete} disabled={deleting}>
                            <span className="icon-close" aria-hidden="true"></span>
                            {deleting ? 'Suppression...' : 'Supprimer'}
                        </button>
                    )}
                </div>
                {deleteError && (
                    <div className="alert alert-danger mt-2">{deleteError}</div>
                )}
            </td>
        </tr>
    );
}

export default ValidationActions;
