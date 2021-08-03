import React from 'react';

import config from '../config';
import standards from '../data/standards';
import projections from '../data/projection.json';

import { Redirect } from "react-router-dom";

class ValidationForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            file: null,
            args: {
                "srs": "CRS:84",
                "model": standards[0].url
            },
            uid: null,
            error: null
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.postFile = this.postFile.bind(this);
        this.onChangeFile = this.onChangeFile.bind(this);
        this.onChangeArgs = this.onChangeArgs.bind(this);
    }

    async handleSubmit(event) {
        event.preventDefault();

        if ( this.state.file == null ){
            this.setState({
                error: 'Fichier non sélectionné'
            });
            return;
        }

        let uid = null;
        try {
            let response = await this.postFile();
            let validation = await response.json();
            uid = validation.uid;
        } catch (e) {
            this.setState({
                error: "Problème dans l'envoi du fichier!"
            })
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
                error: "Problème dans l'envoi des paramètres!"
            })
            return;
        }
    }

    onChangeArgs(event) {
        var args = this.state.args;
        args[event.target.name] = event.target.value;
        this.setState({
            args: args
        });
    }

    onChangeFile(event) {
        this.setState({ file: event.target.files[0] })
    }

    /**
     * Create the validation sending the file.
     * @returns {Promise<Response>}
     */
    postFile() {
        const url = `${config.validatorApiUrl}/validations/`;

        const formData = new FormData();
        formData.append('dataset', this.state.file)

        return fetch(url, {
            method: 'POST',
            body: formData,
        }
        )
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

        return fetch(url, {
            method: 'PATCH',
            body: JSON.stringify(this.state.args),
            headers: {
                'Content-Type': 'application/json'
            }
        })
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

        return (
            <div className="container-fluid">

                {error}

                <form onSubmit={this.handleSubmit}>
                    <div className="form-group row">
                        <label htmlFor="standardSelect" className="col-sm-2 col-form-label">Modèle de données</label>
                        <div className="col-sm-10">
                            <select className="form-control" name="model" id="standardSelect" onChange={this.onChangeArgs}>
                                {standards.map((standard, index) => (
                                    <option key={index} value={standard.url}>{standard.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label htmlFor="srsSelect" className="col-sm-2 col-form-label">Projection des données</label>
                        <div className="col-sm-10">
                            <select className="form-control" name="srs" id="srsSelect" onChange={this.onChangeArgs}>
                                {projections.map((projection, index) => (
                                    <option key={index} value={projection.code}>{projection.code} - {projection.title}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="input-group">
                        <input type="file" className="custom-file-input" id="fileInput" accept="application/zip" onChange={this.onChangeFile} />
                        <label className="custom-file-label" htmlFor="fileInput" placeholder="Ouvrir...">Archive</label>
                    </div>

                    <button type="submit" name="archive" className="btn btn-primary">Valider</button>
                </form>
            </div>
        )
    }
}

export default ValidationForm;
