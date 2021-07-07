import React from 'react';

import standards from '../standards';

import config from '../config';

class ValidationForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            standards: standards
        };

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        const url = `${config.validatorApiUrl}/validations`;
        alert(`TODO : Créer une validation via POST sur ${url}...`)
        event.preventDefault();
    }

    render() {
        return (
            <div className="container-fluid">
                <div className="alert alert-warning" role="alert">
                    Attention, les documents validés par ce démonstrateur ne sont pas forcément valides pour le Géoportail de l'urbanisme, qui réalise des controles supplémentaires.
                </div>

                <form onSubmit={this.handleSubmit}>

                    <div className="form-group">
                        <label htmlFor="standardSelect">Standard</label>
                        <select className="form-control" name="standard" id="standardSelect">
                            {this.state.standards.map((standard, index) => (
                                <option key={index} value={standard.url}>{standard.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="fileInput">Archive</label>
                        <input type="file" className="form-control-file" id="fileInput" accept="application/zip" />
                    </div>

                    <button type="submit" className="btn btn-primary">Valider</button>
                </form>
            </div>
        );
    }
}

export default ValidationForm;
