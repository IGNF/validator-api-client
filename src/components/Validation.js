import React from 'react';
import { withRouter } from 'react-router-dom';

import config from '../config';

import { JsonToTable } from "react-json-to-table";

import DataTable from 'react-data-table-component';


/**
 * Page providing informations
 */
class Validation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            validation: {}
        };
    }

    componentDidMount() {

        var uid = this.props.match.params.uid;
        const url = `${config.validatorApiUrl}/validations/${uid}`;
        fetch(url)
            .then(res => res.json())
            .then((result) => {
                this.setState({
                    validation: result
                });
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    render() {

        if(!this.state.validation.hasOwnProperty('arguments')){
            return null
        }

        const columns = [
            {
              name: 'code',
              selector: 'code',
              sortable: true,
            },
            {
              name: 'message',
              selector: 'message',
              sortable: true,
              right: true,
            },
            {
                name: 'scope',
                selector: 'scope',
                sortable: true,
                right: true,
              },
              {
                name: 'level',
                selector: 'level',
                sortable: true,
                right: true,
              },
              {
                name: 'documentModel',
                selector: 'documentModel',
                sortable: true,
                right: true,
              }
          ];

        return (
            <div className="config">
                <h1>Validation de {this.state.validation.dataset_name}</h1>
                <div className="row">
                <ul>
                    <li>uid: {this.state.validation.uid}</li>
                    <li>dataset_name: {this.state.validation.dataset_name}</li>
                    <li>date_creation: {this.state.validation.date_creation}</li>
                    <li>date_start: {this.state.validation.date_start}</li>
                    <li>date_finish: {this.state.validation.date_finish}</li>
                    <li>status: {this.state.validation.status}</li>
                    <li>arguments :
                         <ul>
                            <li>"srs": {this.state.validation.arguments.srs}</li>
                            <li>"model": {this.state.validation.arguments.model}</li>
                            <li>"max-errors": {this.state.validation.arguments['max-errors']}</li>
                            <li>"normalize": {this.state.validation.arguments.normalize}</li>
                            <li>"encoding": {this.state.validation.arguments.encoding}</li>
                        </ul>
                    </li>
                    <li>"message": {this.state.validation.message}</li>
                </ul>
                    <div id="example"></div>
                    <div className="col-sm">
                        <DataTable title="Errors" data={this.state.validation.results} columns={columns} />
                    </div>

                </div>
            </div>
        )
    }

}

export default withRouter(Validation);