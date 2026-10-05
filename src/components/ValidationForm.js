import React from 'react';

import config from '../config';
import AccessRequired from './AccessRequired';
import AuthContext from './AuthContext';
import Loading from './Loading';
import UploadProgress from './UploadProgress';
import readJsonResponse from '../api/readJsonResponse';
import uploadDataset from '../api/uploadDataset';
import { getFilenameError } from '../data/datasetName';
import standards from '../data/standards';

import projections from '../data/projection.json';

import { Navigate } from "react-router-dom";

import "./ValidationForm.css";

/*
 * Standards grouped by category, keeping their index in `standards` as option value.
 */
const standardGroups = standards.reduce(function (groups, standard, index) {
    let group = groups.find((g) => g.label === standard.category);
    if (!group) {
        group = { label: standard.category, options: [] };
        groups.push(group);
    }
    group.options.push({ standard, index });
    return groups;
}, []);

/**
 * Formulaire de création d'une nouvelle validation.
 */
class ValidationForm extends React.Component {
    static contextType = AuthContext;

    constructor(props) {
        super(props);

        this.state = {
            file: null,
            srs: "EPSG:2154",
            standardIndex: 0,
            uid: null,
            error: null,
            patience: false,
            // progress of the request (see renderProgress) : 'upload', 'arguments' or null
            step: null,
            uploadPercent: 0
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.postFile = this.postFile.bind(this);
        this.onChangeFile = this.onChangeFile.bind(this);
        this.fileLabelRef = React.createRef();
        this.onChangeStandard = this.onChangeStandard.bind(this);
        this.onChangeSrs = this.onChangeSrs.bind(this);
    }


    async handleSubmit(event) {
        event.preventDefault();

        if (this.state.file == null) {
            this.setState({
                error: 'Fichier non sélectionné'
            });
            return;
        }

        const filenameError = getFilenameError(this.state.file.name);
        if (filenameError) {
            this.setState({
                error: filenameError
            });
            return;
        }

        let uid = null;
        this.setState({
            patience: true,
            error: null,
            step: 'upload',
            uploadPercent: 0
        });
        try {
            const validation = await readJsonResponse(await this.postFile());
            uid = validation.uid;
        } catch (e) {
            this.setState({
                error: `Problème dans l'envoi du fichier : ${e.message}`,
                patience: false,
                step: null
            });
            return;
        }

        this.setState({ step: 'arguments' });
        try {
            await readJsonResponse(await this.patchValidation(uid));
            this.setState({
                uid: uid,
                error: null
            });
        } catch (e) {
            this.setState({
                error: `Problème dans l'envoi des paramètres : ${e.message}`,
                patience: false,
                step: null
            });
            return;
        }
    }

    onChangeStandard(event) {
        this.setState({
            standardIndex: event.target.value
        });
    }

    onChangeSrs(event) {
        this.setState({
            srs: event.target.value
        });
    }


    onChangeFile(event) {
        const file = event.target.files[0];
        // warn as soon as the file is selected if its name will be rejected by the API
        this.setState({
            file: file,
            error: file ? getFilenameError(file.name) : null
        });
        if (this.fileLabelRef && this.fileLabelRef.current) {
            this.fileLabelRef.current.textContent = file ? file.name : 'Choisissez une archive sur votre ordinateur...';
        }
    }

    /**
     * Create the validation sending the file (with the upload progress).
     * @returns {Promise<{ok: boolean, status: number, json: function}>}
     */
    postFile() {
        return uploadDataset(this.state.file, (uploadPercent) => {
            this.setState({ uploadPercent });
        });
    }

    /**
     * Progress of the request : upload of the file, then waiting for the server.
     */
    renderProgress() {
        const { step, uploadPercent } = this.state;
        if (step === 'upload' && uploadPercent < 100) {
            return <UploadProgress label="Téléversement de l'archive..." percent={uploadPercent} />;
        }
        if (step === 'upload') {
            return <UploadProgress label="Réception de l'archive par le serveur..." />;
        }
        if (step === 'arguments') {
            return <UploadProgress label="Envoi des paramètres de la validation..." />;
        }
        return null;
    }

    /**
     * Send validation parameters.
     *
     * @param {string} uid
     *
     * @returns {Promise<Response>}
     */
    patchValidation(uid) {
        const url = `${config.validatorApiUrl}/validations/${uid}`;

        const standard = standards[this.state.standardIndex];
        // copy : defaultArguments is shared by all the validations of the standard
        const args = Object.assign({}, standard.defaultArguments, {
            srs: this.state.srs,
            model: standard.url,
            plugins: standard.plugins
        });

        return fetch(url, {
            method: 'PATCH',
            body: JSON.stringify(args),
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    render() {
        if (this.state.uid !== null) {
            return (
                <Navigate to={`/validation/${this.state.uid}`} />
            );
        }

        /*
         * authentication required to create a validation
         */
        const auth = this.context;
        if (auth.loading) {
            return <Loading />;
        }
        if (auth.enabled && !auth.authenticated) {
            return <AccessRequired title="Connexion requise" />;
        }

        /*
         * display form error.
         */
        let error = <span />
        if (this.state.error) {
            error = <div className="alert alert-danger">{this.state.error}</div>;
        }

        return (
            <div className="container-fluid">
                {error}

                <form onSubmit={this.handleSubmit}>
                    <div className="form-group row">
                        <label htmlFor="standardSelect" className="col-sm-4 col-form-label">Sélectionnez un modèle de données</label>
                        <div className="col-sm-8">
                            <select className="form-control" name="model" id="standardSelect" onChange={this.onChangeStandard} disabled={this.state.patience}>
                                {standardGroups.map((group) => (
                                    <optgroup key={group.label} label={group.label}>
                                        {group.options.map(({ standard, index }) => (
                                            <option key={index} value={index}>
                                                {standard.title || standard.name}
                                            </option>
                                        ))}
                                    </optgroup>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label htmlFor="srsSelect" className="col-sm-4 col-form-label">Sélectionnez la projection de vos données</label>
                        <div className="col-sm-8">
                            <select className="form-control" name="srs" id="srsSelect" onChange={this.onChangeSrs} disabled={this.state.patience}>
                                {projections.map((projection, index) => (
                                    <option key={index} value={projection.code}>{projection.code} - {projection.title}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="input-group form-group">
                        <input type="file" className="custom-file-input" id="fileInput" accept="application/zip" onChange={this.onChangeFile} disabled={this.state.patience} />
                        <label ref={this.fileLabelRef} className="custom-file-label" htmlFor="fileInput" placeholder="Ouvrir...">
                            Choisissez une archive sur votre ordinateur...
                        </label>
                    </div>

                    <div className="form-group text-center">
                        <button type="submit" name="archive" className="btn btn--plain btn--primary btn-width--lg" disabled={this.state.patience}>
                            {this.state.patience ? 'Téléversement en cours...' : 'Valider'}
                        </button>
                        {this.renderProgress()}
                    </div>
                </form>
            </div>
        )
    }
}

export default ValidationForm;
