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
        let gpuStandards = [
            {
                "name": "cnig_CC_2013",
                "url": "https://www.geoportail-urbanisme.gouv.fr/standard/cnig_CC_2013.json"
            },
            {
                "name": "cnig_CC_2014",
                "url": "https://www.geoportail-urbanisme.gouv.fr/standard/cnig_CC_2014.json"
            }
        ];
        // TODO charger les standards disponibles à partir de https://www.geoportail-urbanisme.gouv.fr/standard.json
        this.setState({
            standards: gpuStandards
        })
    }


    render() {
        // TODO : bootstrapifier le form (attention : mettre className pour class avec react)
        return (
            <form className="tutu" onSubmit={this.handleSubmit}>
                <input type="text" name="standard" />
                <input type="file" name="archive" accept="application/zip"></input>
                <input type="submit" value="Submit" />
            </form>
        );
    }
}

export default ValidationForm;
