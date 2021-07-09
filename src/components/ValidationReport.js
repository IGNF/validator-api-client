import React from 'react';

import DataTable from 'react-data-table-component';

class ValidationReport extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {

        if (this.props.validation.results === null) {
            return null;
        }

        const columns = [
            {
                name: 'level',
                selector: 'level',
                sortable: true
            },
            {
                name: 'scope',
                selector: 'scope',
                sortable: true,
                compact: true
            },
            {
                name: 'code',
                selector: 'code',
                sortable: true,
                compact: true
            },
            {
                name: 'message',
                selector: 'message',
                sortable: true,
                grow: 10
            }
        ];

        const conditionalRowStyles = [
            {
                when: row => row.level === 'WARNING',
                style: { backgroundColor: '#fcf8e3' },
            },
            {
                when: row => row.level === 'ERROR',
                style: { backgroundColor: '#f2dede' },
            },
            {
                when: row => row.level === 'INFO',
                style: { backgroundColor: '#eeeeee' },
            },
        ];

        return (
            <div className="card">
                <DataTable title="Rapport de validation"
                    data={this.props.validation.results}
                    columns={columns}
                    conditionalRowStyles={conditionalRowStyles}
                    striped="true" />
            </div>
        )
    }
}

export default ValidationReport;