import React from 'react';

import standards from '../standards';

class ValidationForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            standards: standards
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.fileUpload = this.fileUpload.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    handleSubmit(event) {

        event.preventDefault()

        this.fileUpload(this.state.file)
        .then((response) => response.json())
		.then((result) => {
			console.log('Success:', result);
		})
		.catch((error) => {
			console.error('Error:', error);
		});
    }

    onChange(event) {
        this.setState({file:event.target.files[0]})
    }

    fileUpload(file){
        const url = 'http://127.0.0.1:35033/validator/validations/';
        const formData = new FormData();
        formData.append('dataset',file)

        return fetch(
			url,
			{
				method: 'POST',
				body: formData,
			}
		)
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
                        <input type="file" className="form-control-file" id="fileInput" accept="application/zip" onChange={this.onChange} />
                    </div>

                    <button type="submit" name="archive" className="btn btn-primary">Valider</button>
                </form>
            </div>
        );
    }
}

export default ValidationForm;
