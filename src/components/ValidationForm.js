import React from 'react';

import config from '../config';
import standards from '../standards';

import { Redirect } from "react-router-dom";

class ValidationForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            args: {
                "srs": "EPSG:2154",
                "model": "https://www.geoportail-urbanisme.gouv.fr/standard/cnig_CC_2013.json"
            },
            uid: null
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.postFile = this.postFile.bind(this);
        this.onChangeFile = this.onChangeFile.bind(this);
        this.onChangeArgs = this.onChangeArgs.bind(this);
    }

    handleSubmit(event) {

        event.preventDefault();

        var uid = "";

        this.postFile()
            .then((response) => response.json())
            .then((result) => {
                uid = result.uid;
            }).then(() => {
                return this.patchValidation(uid);
            }).then(() => {
                this.setState({
                    uid: uid
                });
            })
            .catch((error) => {
                console.error('Error:', error);
            });
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

        if ( this.state.uid !== null ){
            return (
                <Redirect push to={`/validation/${this.state.uid}`} />
            );
        }

        var srsList = [
            'EPSG:2154',
            'EPSG:4326',
            'EPSG:32620',
            'EPSG:4559',
            'EPSG:5490',
            'EPSG:2972',
            'EPSG:2975',
            'EPSG:4467',
            'EPSG:4471',
            'CRS:84'
        ];

        return (
            <div className="container-fluid">
                <div className="alert alert-warning" role="alert">
                    Attention, les documents validés par ce démonstrateur ne sont pas forcément valides pour le Géoportail de l'urbanisme, qui réalise des controles supplémentaires.
                </div>

                <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="fileInput">Archive</label>
                        <input type="file" className="form-control-file" id="fileInput" accept="application/zip" onChange={this.onChangeFile} />
                    </div>

                    <div className="form-group row">
                        <label htmlFor="standardSelect" className="col-sm-2 col-form-label">Standard</label>
                        <div className="col-sm-10">
                            <select className="form-control" name="model" id="standardSelect" onChange={this.onChangeArgs}>
                                {standards.map((standard, index) => (
                                    <option key={index} value={standard.url}>{standard.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label htmlFor="srsSelect" className="col-sm-2 col-form-label">SRS</label>
                        <div className="col-sm-10">
                            <select className="form-control" name="srs" id="srsSelect" onChange={this.onChangeArgs}>
                                {srsList.map((srsItem, index) => (
                                    <option key={index} value={srsItem}>{srsItem}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <button type="submit" name="archive" className="btn btn-primary">Valider</button>
                </form>
            </div>
        )
    }
}

export default ValidationForm;
