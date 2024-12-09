import React from 'react';

import config from '../config';
import standards from '../data/standards';
import projections from '../data/projection.json';

import { Redirect } from "react-router-dom";

import "./ValidationForm.css";

/**
 * Formulaire de création d'une nouvelle validation.
 */
class ValidationForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            file: null,
            srs: "EPSG:2154",
            standardIndex: 0,
            uid: null,
            error: null,
            patience: false
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.postFile = this.postFile.bind(this);
        this.onChangeFile = this.onChangeFile.bind(this);
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

        let uid = null;
        this.setState({
            patience: true
        });
        try {
            let response = await this.postFile();
            let validation = await response.json();
            uid = validation.uid;
        } catch (e) {
            this.setState({
                error: "Problème dans l'envoi du fichier !",
                patience: false
            });
            return;
        }

        console.log(`Validation created with uid=${uid}`);
        try {
            await this.patchValidation(uid);
            this.setState({
                uid: uid,
                error: null
            });
        } catch (e) {
            this.setState({
                error: "Problème dans l'envoi des paramètres !",
                patience: false
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
        this.setState({ file: event.target.files[0] });
        $('.custom-file-label').html(event.target.files[0].name);
    }

    /**
     * Create the validation sending the file.
     * @returns {Promise<Response>}
     */
    postFile() {
        const url = `${config.validatorApiUrl}/validations/`;

        const formData = new FormData();
        formData.append('dataset', this.state.file);

        return fetch(url, {
            method: 'POST',
            body: formData,
        });
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
        let args = {};
        if (standard && standard.defaultArguments) {
            args = standard.defaultArguments;
        }
        args = Object.assign(args, {
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
                <Redirect push to={`/validation/${this.state.uid}`} />
            );
        }

        /*
         * display form error.
         */
        let error = <span />
        if (this.state.error) {
            error = <div className="alert alert-danger">{this.state.error}</div>;
        }

        if (this.state.patience) {
            console.log("patience");
        }

        return (
            <div className="container-fluid">
                {error}

                <form onSubmit={this.handleSubmit}>
                    <div className="form-group row">
                        <label htmlFor="standardSelect" className="col-sm-4 col-form-label">Sélectionnez un modèle de données</label>
                        <div className="col-sm-8">
                            <select className="form-control" name="model" id="standardSelect" onChange={this.onChangeStandard} disabled={this.state.patience}>
                                {standards.map((standard, index) => (
                                    <option key={index} value={index}>
                                        {standard.title || standard.name}
                                    </option>
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
                        <label className="custom-file-label" htmlFor="fileInput" placeholder="Ouvrir...">
                            Choisissez une archive sur votre ordinateur...
                        </label>
                    </div>

                    <div className="form-group text-center">
                        <button type="submit" name="archive" className="btn btn--plain btn--primary btn-width--lg" disabled={this.state.patience}>
                            {this.state.patience ? 'Téléversement en cours...' : 'Valider'}
                        </button>
                    </div>
                </form>
            </div>
        )
    }
}

export default ValidationForm;
