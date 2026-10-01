import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import config from '../config';

import deleteValidationById from '../api/deleteValidationById';
import getAvailableDownloads from '../api/getAvailableDownloads';

/**
 * Affichage des actions possibles sur la validation
 */
function ValidationActions({ validation }) {
    const navigate = useNavigate();
    // source and normalized data downloads can be disabled by the API
    const [downloads, setDownloads] = useState({ source: false, normalized: false });

    useEffect(() => {
        let cancelled = false;
        getAvailableDownloads().then((available) => {
            if (!cancelled) {
                setDownloads(available);
            }
        });
        return () => {
            cancelled = true;
        };
    }, []);

    if (validation.status !== 'finished') {
        return null;
    }

    const uid = validation.uid;

    const csvLink = `${config.validatorApiUrl}/validations/${uid}/results.csv`;
    const sourceLink = `${config.validatorApiUrl}/validations/${uid}/files/source`;
    const normalizedLink = `${config.validatorApiUrl}/validations/${uid}/files/normalized`;

    function onClickDelete() {
        if (!window.confirm('Confirmer la suppression?')) {
            return false;
        }
        deleteValidationById(uid).then(() => {
            navigate('/');
        }).catch((error) => {
            console.log(error);
        });
    }

    return (
        <table className="table table-striped">
            <tbody>
                <tr>
                    <td className="col-2">Actions</td>
                    <td>
                        <a href={csvLink}>Télécharger le rapport au format CSV</a><br />
                        {downloads.source && (
                            <><a href={sourceLink}>Télécharger les fichiers sources</a><br /></>
                        )}
                        {downloads.normalized && (
                            <><a href={normalizedLink}>Télécharger les fichiers normalisés</a><br /></>
                        )}

                        <a href="#" onClick={onClickDelete}>
                            <span className="icon-trash"></span>
                            Supprimer la validation
                        </a>
                    </td>
                </tr>
            </tbody>
        </table>
    );
}

export default ValidationActions;

