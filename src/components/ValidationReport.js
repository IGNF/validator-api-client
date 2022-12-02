import React from 'react';

import DataTable from 'react-data-table-component';

import ValidationError from './ValidationError';

class ValidationReport extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selected: null
        };

        this.onRowClicked = this.onRowClicked.bind(this);
        this.closeErrorPopup = this.closeErrorPopup.bind(this);
    }

    onRowClicked(row) {
        this.setState({
            selected: row
        });
    }

    closeErrorPopup() {
        this.setState({
            selected: null
        })
    }

    render() {

        if (this.props.validation.results === null) {
            return null;
        }

        const columns = [
            {
                name: 'Fichier',
                selector: row => row.file,
                sortable: true,
                grow: 2
            },
            {
                name: 'Code',
                selector: row => row.code,
                sortable: true,
                grow: 2
            },
            {
                name: 'Message',
                selector: row => row.message,
                sortable: true,
                wrap: true,
                grow: 7
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
            <div>
                <ValidationError error={this.state.selected} closeErrorPopup={this.closeErrorPopup} />
                <div className="card mb-2">
                    <DataTable title="Rapport de validation"
                        data={this.props.validation.results}
                        columns={columns}
                        conditionalRowStyles={conditionalRowStyles}
                        responsive="true"
                        pointerOnHover="true"
                        highlightOnHover="true"
                        striped="true"
                        onRowClicked={this.onRowClicked}
                    />
                </div>

            </div>
        )
    }
}

export default ValidationReport;