import React from 'react';

import "./DocumentInfo.css";

const FILE_TYPE_LABELS = {
    table: 'Table',
    pdf: 'PDF',
    directory: 'Dossier',
    metadata: 'Métadonnées'
};

const formatCount = (value) => value.toLocaleString('fr-FR');

/**
 * Emprise [xmin, ymin, xmax, ymax] en longitude/latitude (WGS84)
 */
function Extent({ boundingBox }) {
    if (!Array.isArray(boundingBox) || boundingBox.length !== 4) {
        return null;
    }
    const [xmin, ymin, xmax, ymax] = boundingBox;
    const format = (value) => Number(value).toFixed(4);
    return (
        <span className="document-info__extent">
            {format(xmin)}, {format(ymin)} → {format(xmax)}, {format(ymax)}
        </span>
    );
}

function Stat({ value, label }) {
    return (
        <div className="document-info__stat">
            <div className="document-info__stat-value">{formatCount(value)}</div>
            <div className="document-info__stat-label">{label}</div>
        </div>
    );
}

/**
 * Lignes clé/valeur, en ignorant les valeurs vides
 */
function Properties({ rows }) {
    const filled = rows.filter(([, value]) => value !== null && value !== undefined && value !== '');
    if (filled.length === 0) {
        return null;
    }
    return (
        <table className="table table-sm document-info__properties">
            <tbody>
                {filled.map(([label, value]) => (
                    <tr key={label}>
                        <th scope="row">{label}</th>
                        <td>{value}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

/**
 * Tables de données avec leurs comptages et emprises (sous-tables pour les GeoPackage)
 */
function DataTables({ files }) {
    if (files.length === 0) {
        return null;
    }
    return (
        <table className="table table-sm table-striped">
            <thead>
                <tr>
                    <th>Fichier</th>
                    <th>Modèle de fichier</th>
                    <th className="text-right">Entités</th>
                    <th>Emprise</th>
                </tr>
            </thead>
            <tbody>
                {files.map((file) => (
                    <React.Fragment key={file.path}>
                        <tr>
                            <td>{file.path}</td>
                            <td>{file.modelName}</td>
                            <td className="text-right">
                                {file.totalFeatures === undefined || file.totalFeatures === null ? '' : formatCount(file.totalFeatures)}
                            </td>
                            <td><Extent boundingBox={file.boundingBox} /></td>
                        </tr>
                        {Object.entries(file.tables || {}).map(([tableName, stats]) => (
                            <tr key={`${file.path}/${tableName}`} className="document-info__subtable">
                                <td>{tableName}</td>
                                <td></td>
                                <td className="text-right">{formatCount(stats.totalFeatures)}</td>
                                <td><Extent boundingBox={stats.boundingBox} /></td>
                            </tr>
                        ))}
                    </React.Fragment>
                ))}
            </tbody>
        </table>
    );
}

function OtherFiles({ files }) {
    if (files.length === 0) {
        return null;
    }
    return (
        <details className="document-info__section">
            <summary>Autres fichiers ({files.length})</summary>
            <table className="table table-sm table-striped">
                <thead>
                    <tr>
                        <th>Fichier</th>
                        <th>Type</th>
                        <th>Modèle de fichier</th>
                    </tr>
                </thead>
                <tbody>
                    {files.map((file) => (
                        <tr key={file.path}>
                            <td>{file.path}</td>
                            <td>{FILE_TYPE_LABELS[file.type] || file.type}</td>
                            <td>{file.modelName}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </details>
    );
}

function Metadata({ metadata }) {
    if (!metadata) {
        return null;
    }
    const contact = metadata.contact || {};
    const crs = metadata.referenceSystemIdentifier && metadata.referenceSystemIdentifier.code;
    const specifications = (metadata.specifications || []).map((spec) => spec.title).filter(Boolean).join(', ');
    const locators = (metadata.locators || []).filter((locator) => locator.url);

    return (
        <details className="document-info__section">
            <summary>Métadonnées</summary>
            <Properties rows={[
                ['Identifiant', metadata.fileIdentifier],
                ['Résumé', metadata.abstract],
                ['Généalogie', metadata.lineage],
                ['Système de référence', crs],
                ['Spécifications', specifications],
                ['Date de création', metadata.dateOfCreation],
                ['Date de publication', metadata.dateOfPublication],
                ['Date de révision', metadata.dateOfLastRevision],
                ['Contact', [contact.organisationName, contact.electronicMailAddress].filter(Boolean).join(' - ')],
                ['Date des métadonnées', metadata.metadataDate],
                ['Liens', locators.length > 0 && (
                    <ul className="list-unstyled mb-0">
                        {locators.map((locator, index) => (
                            <li key={index}>
                                <a href={locator.url} target="_blank" rel="noopener noreferrer">
                                    {locator.name || locator.url}
                                </a>
                                {locator.protocol && ` (${locator.protocol})`}
                            </li>
                        ))}
                    </ul>
                )]
            ]} />
        </details>
    );
}

/**
 * Affichage des informations extraites du document par le validateur
 * (document-info.json, produit uniquement si l'option "normalize" est activée)
 */
function DocumentInfo({ documentInfo }) {
    if (!documentInfo) {
        return null;
    }

    const files = documentInfo.files || [];
    const tables = files.filter((file) => file.type === 'table');
    const otherFiles = files.filter((file) => file.type !== 'table');
    const totalFeatures = tables.reduce((total, file) => total + (file.totalFeatures || 0), 0);
    const countByType = (type) => files.filter((file) => file.type === type).length;
    const title = documentInfo.metadata && documentInfo.metadata.title;
    const tags = Object.entries(documentInfo.tags || {});

    const jsonUrl = 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(documentInfo, null, 2));

    return (
        <div className="card mb-2 document-info">
            <div className="card-body">
                <div className="document-info__header">
                    <h2 className="h5 card-title">Informations sur le document</h2>
                    <a className="btn btn-sm btn--ghost btn--primary" href={jsonUrl} download="document-info.json">
                        <span className="icon-download" aria-hidden="true"></span> document-info.json
                    </a>
                </div>

                <div className="document-info__stats">
                    <Stat value={tables.length} label={tables.length > 1 ? 'tables' : 'table'} />
                    <Stat value={totalFeatures} label={totalFeatures > 1 ? 'entités' : 'entité'} />
                    <Stat value={countByType('pdf')} label="PDF" />
                    <Stat value={files.length} label={files.length > 1 ? 'fichiers' : 'fichier'} />
                </div>

                <Properties rows={[
                    ['Nom', documentInfo.name],
                    ['Modèle', documentInfo.documentModel && documentInfo.documentModel.name],
                    ['Titre', title],
                    ...tags.map(([key, value]) => [key, value]),
                    ['Emprise', documentInfo.documentExtent && <Extent boundingBox={documentInfo.documentExtent} />]
                ]} />

                <DataTables files={tables} />
                <OtherFiles files={otherFiles} />
                <Metadata metadata={documentInfo.metadata} />
            </div>
        </div>
    );
}

export default DocumentInfo;
