import React, { useState } from 'react';

import config from '../config';
import ValidationLine from './ValidationLine.js'
/**
 * Formulaire de création d'une nouvelle validation.
 */
class Dashboard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            user: props.user ? props.user : 0,
            refreshRate: props.refreshRate ? props.refreshRate : 10000,
            validationArray: []
        }
    }

    async tick() {
        const validations = await this.getValidations(this.state.user);
        this.setState({validationArray: validations});
    }

    componentDidMount() {
        this.interval = setInterval(() => this.tick(), this.state.refreshRate);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    async getValidations(user) {
        const url = `${config.validatorPubliUrl}/validation/by-user/${user}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                this.state.error = `Response status: ${response.status}`;
            }
            const jsonResponse = await response.json();
            return jsonResponse;
        } catch (error) {
            this.state.error = error.message;
            return []
        }
    }

    render() {
        /*
         * display form error.
         */
        let error = <span />
        if (this.state.error) {
            error = <div className="alert alert-danger">{this.state.error}</div>;
        }

        if (this.state.patience) {
            console.log("patience");
        }

        const listComps = this.state.validationArray.forEach(validation => <ValidationLine validation={validation}/>);

        return (
            <div className="container-fluid">
                {error}

                <table>
                    <thead>
                        <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Nom</th>
                            <th scope="col">Statut</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listComps}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default Dashboard;
