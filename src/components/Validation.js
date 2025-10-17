import React from 'react';
import { withRouter } from 'react-router-dom';
import ValidationReport from './ValidationReport';

import getValidationById from '../api/getValidationById';

import PageTitle from './PageTitle';
import ValidationActions from './ValidationActions';
import ValidationProperties from './ValidationProperties';

const STATUS_COMPLETED = ['finished', 'error', 'archived'];

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
                setTimeout(this.updateData.bind(this), 2000);
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

        return (
            <div className="container-content">
                <PageTitle title={"Validation de " + this.state.validation.dataset_name} />
                <div className="container-content">
                    <ValidationProperties validation={this.state.validation} />
                    <ValidationActions validation={this.state.validation} />
                    <ValidationReport validation={this.state.validation} />
                </div>
            </div>
        )
    }

}

export default withRouter(Validation);