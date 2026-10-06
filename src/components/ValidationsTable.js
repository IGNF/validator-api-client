import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';

import deleteValidationById from '../api/deleteValidationById';
import listValidations from '../api/listValidations';
import standards from '../data/standards';

import StatusBadge from './StatusBadge';
import { ValidationResult } from './ValidationProperties';

import './ValidationActions.css';
import './ValidationsTable.css';

export const STATUSES = {
    waiting_for_args: 'En attente de paramètres',
    pending: 'En attente',
    processing: 'En cours',
    finished: 'Terminée',
    error: 'En erreur',
    archived: 'Archivée'
};

const PER_PAGE = 20;

function formatDate(value) {
    return value ? new Date(value).toLocaleString('fr-FR') : '';
}

function ownerLabel(row) {
    return row.owner_name || row.owner;
}

/**
 * Nom du modèle : celui lu par le validateur, sinon celui de la liste des standards, sinon l'URL.
 */
function modelLabel(row) {
    const model = row.arguments && row.arguments.model;
    if (!model) {
        return null;
    }
    const documentModel = row.document_info && row.document_info.documentModel;
    if (documentModel && documentModel.name) {
        return documentModel.name;
    }
    const standard = standards.find((standard) => standard.url === model);
    return standard ? (standard.title || standard.name) : model;
}

/**
 * Liste paginée des validations (GET /api/validations/) : celles de l'utilisateur, ou toutes pour un
 * administrateur (showOwner : colonne et filtre par propriétaire, showModel : colonne du modèle).
 *
 * @param {object} props
 * @param {boolean} [props.showOwner]
 * @param {boolean} [props.showModel]
 * @param {string} [props.emptyMessage]
 */
function ValidationsTable({ showOwner = false, showModel = false, emptyMessage = 'Aucune validation' }) {
    const [page, setPage] = useState(1);
    const [status, setStatus] = useState('');
    // { id, label } of the owner filter (admins)
    const [owner, setOwner] = useState(null);
    const [result, setResult] = useState({ items: [], total: 0 });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const load = useCallback(() => {
        setLoading(true);
        setError(null);
        const params = { page, limit: PER_PAGE, status };
        if (owner) {
            params.owner = owner.id;
        }
        return listValidations(params).then((data) => {
            setResult(data);
        }).catch((err) => {
            console.error(err);
            setError(err.message);
        }).finally(() => {
            setLoading(false);
        });
    }, [page, status, owner]);

    useEffect(() => {
        load();
    }, [load]);

    function onClickDelete(validation) {
        if (!window.confirm(`Confirmer la suppression de ${validation.dataset_name} ?`)) {
            return;
        }
        deleteValidationById(validation.uid).then(load).catch((err) => {
            console.error(err);
            setError(err.message || 'La suppression a échoué');
        });
    }

    function onChangeStatus(event) {
        setStatus(event.target.value);
        setPage(1);
    }

    function filterByOwner(row) {
        setOwner({ id: row.owner, label: ownerLabel(row) });
        setPage(1);
    }

    function clearOwner() {
        setOwner(null);
        setPage(1);
    }

    const columns = [
        {
            name: 'Jeu de données',
            cell: row => <Link to={`/validation/${row.uid}`}>{row.dataset_name}</Link>,
            grow: 2
        },
        showOwner && {
            name: 'Propriétaire',
            cell: row => row.owner ? (
                <button type="button" className="validations-table__owner" title="Afficher uniquement ses validations"
                    onClick={() => filterByOwner(row)}>
                    {ownerLabel(row)}
                </button>
            ) : <em className="text-muted">anonyme</em>
        },
        showModel && {
            name: 'Modèle',
            cell: row => <span title={row.arguments && row.arguments.model}>{modelLabel(row)}</span>,
            grow: 2
        },
        {
            name: 'Statut',
            cell: row => <StatusBadge status={row.status} />
        },
        {
            name: 'Résultat',
            cell: row => <ValidationResult validation={row} />
        },
        {
            name: 'Création',
            selector: row => formatDate(row.date_creation)
        },
        {
            name: 'Fin',
            selector: row => formatDate(row.date_finish)
        },
        {
            name: 'Actions',
            cell: row => row.can_edit && (
                <button type="button" className="btn btn-sm btn--ghost btn--danger"
                    onClick={() => onClickDelete(row)} disabled={row.status === 'processing'}>
                    Supprimer
                </button>
            ),
            button: true,
            width: '140px'
        }
    ].filter(Boolean);

    return (
        <>
            <div className="validations-table__filters">
                <div>
                    <label htmlFor="statusFilter">Statut</label>
                    <select id="statusFilter" className="form-control" value={status} onChange={onChangeStatus}>
                        <option value="">Tous</option>
                        {Object.entries(STATUSES).map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                        ))}
                    </select>
                </div>
                {owner && (
                    <span className="validations-table__chip">
                        Propriétaire : {owner.label}
                        <button type="button" onClick={clearOwner} aria-label="Retirer le filtre sur le propriétaire">
                            <span className="icon-close" aria-hidden="true"></span>
                        </button>
                    </span>
                )}
            </div>
            {error && <div className="alert alert-danger" role="alert">{error}</div>}
            <DataTable
                columns={columns}
                data={result.items}
                keyField="uid"
                progressPending={loading}
                pagination
                paginationServer
                paginationTotalRows={result.total}
                paginationPerPage={PER_PAGE}
                paginationRowsPerPageOptions={[PER_PAGE]}
                paginationDefaultPage={page}
                onChangePage={setPage}
                noDataComponent={<p className="my-4">{emptyMessage}</p>}
                striped
            />
        </>
    );
}

export default ValidationsTable;
