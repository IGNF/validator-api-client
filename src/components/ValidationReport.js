import React from 'react';

import DataTable from 'react-data-table-component';

import ValidationError from './ValidationError';

import './ValidationReport.css';

/**
 * Chemin complet du fichier, avec un retour à la ligne possible après chaque "/".
 */
export function FilePath({ path }) {
    if (!path) {
        return null;
    }
    const parts = path.split('/');
    return (
        <span className="validation-report__file" title={path}>
            {parts.map((part, index) => (
                <React.Fragment key={index}>
                    {part}
                    {index < parts.length - 1 && <>/<wbr /></>}
                </React.Fragment>
            ))}
        </span>
    );
}

/**
 * Code d'erreur, avec un retour à la ligne possible après chaque "_"
 * (ex : DGPR_ISO_HT_FUSION_NOT_SURFACE_INOND).
 */
export function ErrorCode({ code }) {
    if (!code) {
        return null;
    }
    const parts = code.split('_');
    return (
        <span className="validation-report__code">
            {parts.map((part, index) => (
                <React.Fragment key={index}>
                    {part}
                    {index < parts.length - 1 && <>_<wbr /></>}
                </React.Fragment>
            ))}
        </span>
    );
}

/**
 * Les contrôles sur la base de validation (unicité, références, DGPR...) rattachent l'erreur
 * au dossier du document ("TRI_BEZIERS/") : la table (fileModel) est alors plus précise.
 */
const isDirectory = (file) => !file || file.endsWith('/');

export function locationOf(row) {
    if (isDirectory(row.file) && row.fileModel) {
        return row.fileModel;
    }
    return row.file;
}

/**
 * Fichier, ou table et objet pour les erreurs des contrôles sur la base de validation
 */
export function ResultLocation({ row }) {
    if (!isDirectory(row.file) || !row.fileModel) {
        return <FilePath path={row.file} />;
    }
    return (
        <span className="validation-report__file" title={row.file}>
            {row.fileModel}
            {row.featureId && <span className="validation-report__feature">objet {row.featureId}</span>}
        </span>
    );
}

// zip pre-validation errors (file, code, message) have no level : they are errors
const levelOf = row => row.level || 'ERROR';

const SUMMARY_LEVELS = [
    { level: 'ERROR', singular: 'erreur', plural: 'erreurs', className: 'badge-danger' },
    { level: 'WARNING', singular: 'avertissement', plural: 'avertissements', className: 'badge-warning' },
    { level: 'INFO', singular: 'info', plural: 'infos', className: 'badge-secondary' }
];

/**
 * Nombre d'anomalies par niveau (ex : "12 erreurs", "34 avertissements", "5 infos").
 */
export function ReportSummary({ results }) {
    if (results.length === 0) {
        return <p className="validation-report__summary">Aucune anomalie</p>;
    }
    return (
        <p className="validation-report__summary">
            {SUMMARY_LEVELS.map(({ level, singular, plural, className }) => {
                const count = results.filter((row) => levelOf(row) === level).length;
                return count > 0 && (
                    <span key={level} className={`badge ${className}`}>
                        {count} {count > 1 ? plural : singular}
                    </span>
                );
            })}
        </p>
    );
}

class ValidationReport extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selected: null
        };

        this.onRowClicked = this.onRowClicked.bind(this);
        this.closeErrorPopup = this.closeErrorPopup.bind(this);
    }

    onRowClicked(row) {
        this.setState({
            selected: row
        });
    }

    closeErrorPopup() {
        this.setState({
            selected: null
        })
    }

    render() {

        if (!Array.isArray(this.props.validation.results)) {
            return null;
        }

        const columns = [
            {
                name: 'Fichier / table',
                selector: row => locationOf(row),
                cell: row => <ResultLocation row={row} />,
                sortable: true,
                wrap: true,
                grow: 3
            },
            {
                name: 'Code',
                selector: row => row.code,
                cell: row => <ErrorCode code={row.code} />,
                sortable: true,
                wrap: true,
                grow: 3
            },
            {
                name: 'Message',
                selector: row => row.message,
                sortable: true,
                wrap: true,
                grow: 7
            }
        ];

        const conditionalRowStyles = [
            {
                when: row => levelOf(row) === 'WARNING',
                style: { backgroundColor: '#fcf8e3' },
            },
            {
                when: row => levelOf(row) === 'ERROR',
                style: { backgroundColor: '#f2dede' },
            },
            {
                when: row => levelOf(row) === 'INFO',
                style: { backgroundColor: '#eeeeee' },
            },
        ];

        return (
            <div>
                <ValidationError error={this.state.selected} closeErrorPopup={this.closeErrorPopup} />
                <ReportSummary results={this.props.validation.results} />
                <div className="card mb-2">
                    <DataTable title="Rapport de validation"
                        data={this.props.validation.results}
                        columns={columns}
                        conditionalRowStyles={conditionalRowStyles}
                        responsive="true"
                        pointerOnHover="true"
                        highlightOnHover="true"
                        striped="true"
                        onRowClicked={this.onRowClicked}
                    />
                </div>

            </div>
        )
    }
}

export default ValidationReport;