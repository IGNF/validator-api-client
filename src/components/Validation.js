import React from 'react';
import { withRouter } from 'react-router-dom';

import config from '../config';

import ValidationReport from './ValidationReport';

class Validation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            validation: {}
        }
    }

    componentDidMount() {
        this.updateData();
    }

    getValidationId() {
        return this.props.match.params.uid;
    }

    updateData() {
        const uid = this.getValidationId();
        const url = `${config.validatorApiUrl}/validations/${uid}`;

        fetch(url)
            .then(res => res.json())
            .then((result) => {
                if (result.status != 'finished') {
                    setTimeout(this.updateData.bind(this), 1000);
                }
                this.setState({
                    validation: result
                });
            })
            .catch((error) => {
                console.error('Error:', error)
            });
    }

    render() {
        if (!this.state.validation.hasOwnProperty('arguments')) {
            return null
        }

        const renderArguments = () => {
            if (this.state.validation.arguments === null) {
                return null;
            } else {
                return <ul>
                    <li>srs: {this.state.validation.arguments.srs}</li>
                    <li>model: {this.state.validation.arguments.model}</li>
                </ul>
            }
        }

        return (
            <div>
                <div className="jumbotron jumbotron-fluid">
                    <div className="container">
                        <h1 className="display-4">Validation de {this.state.validation.dataset_name}</h1>
                    </div>
                </div>

                <div>
                    <ul>
                        <li>Statut: {this.state.validation.status}</li>
                        <li>Arguments : {renderArguments()}</li>
                    </ul>
                    <ValidationReport validation={this.state.validation} />
                </div>
            </div>
        )
    }

}

export default withRouter(Validation);