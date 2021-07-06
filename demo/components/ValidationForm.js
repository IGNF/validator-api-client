import React from 'react';

class ValidationForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            standards: []
        };

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        alert("TODO : Créer une validation via POST /api/validations ...")
        event.preventDefault();
    }

    componentDidMount() {
        fetch("/samples/gpu-standards.json")
            .then(res => res.json())
            .then((result) => {
                this.setState({
                    standards: result
                });
            })
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
