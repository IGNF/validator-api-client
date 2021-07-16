import React from 'react';

import "./ValidationError.css";


class ValidationError extends React.Component {
    constructor(props) {
        super(props);

        this.onClose = this.onClose.bind(this);
    }

    onClose() {
        this.props.closeErrorPopup();
    }

    render() {
        if (!this.props.error) {
            return <div></div>;
        }

        const error = this.props.error;

        let rows = [];
        let index = 0;
        for (let key of Object.keys(error)) {
            let value = error[key];
            if (value == null || value == '') {
                continue;
            }
            rows.push(
                <tr key={index++}>
                    <td>{key}</td>
                    <td>{value}</td>
                </tr>
            );
        }

        return (
            <div className="validator-error">
                <button type="button" className="btn btn-primary float-right" onClick={this.onClose}>X</button>

                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th className="col-2">Propriété</th>
                            <th className="col-10">Valeur</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default ValidationError;

