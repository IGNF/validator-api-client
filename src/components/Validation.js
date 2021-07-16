import React from 'react';
import { withRouter } from 'react-router-dom';

import config from '../config';

import ValidationReport from './ValidationReport';

import getValidationById from '../api/getDeliveryById';

const STATUS_COMPLETED = ['finished', 'error'];

class Validation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            validation: {},
            error: null
        }
    }

    componentDidMount() {
        this.updateData();
    }

    getValidationId() {
        return this.props.match.params.uid;
    }

    /**
     * Upload validation data.
     */
    updateData() {
        const uid = this.getValidationId();

        getValidationById(uid).then((validation) => {
            if (!STATUS_COMPLETED.includes(validation.status)) {
                setTimeout(this.updateData.bind(this), 1000);
            }
            this.setState({
                validation: validation
            });
        }).catch((error) => {
            console.log(error);
            this.setState({
                error: error
            });
        });
    }


    render() {
        if (this.state.error != null) {
            return (
                <div className="alert alert-danger">
                    {this.state.error.message}
                </div>
            );
        }

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