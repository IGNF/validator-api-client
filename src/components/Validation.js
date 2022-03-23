import React from 'react';
import { withRouter } from 'react-router-dom';

import config from '../config';

import ValidationReport from './ValidationReport';

import getValidationById from '../api/getDeliveryById';

import PageTitle from './PageTitle';
import StatusBadge from './StatusBadge';

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
                <div className="container-content pt-1">
                    <div className="alert alert-danger">
                        {this.state.error.message}
                    </div>
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
                    <li>
                        <strong>Modèle :</strong>&nbsp;
                        <a className="external-link"
                            target="_blank"
                            href={this.state.validation.arguments.model}>
                                {this.state.validation.arguments.model}
                                <span className="icon-external-link" aria-hidden="true"></span>
                        </a>
                    </li>
                    <li><strong>Projection :</strong> {this.state.validation.arguments.srs}</li>
                </ul>
            }
        }

        return (
            <div className="container-content">
                <PageTitle title={"Validation de " + this.state.validation.dataset_name}/>
                <div className="container-content">
                    <div className="wysiwyg">
                        <p>
                            <strong>Statut : </strong>
                            <StatusBadge status={this.state.validation.status}/>
                        </p>
                        {renderArguments()}
                    </div>
                    <ValidationReport validation={this.state.validation} />
                </div>
            </div>
        )
    }

}

export default withRouter(Validation);