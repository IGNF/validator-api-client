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
                <li key={index++}><strong>{key} :</strong> {value}</li>
            );
        }

        return (
            <div className="validator-error">
                <button type="button"
                    className="btn float-right"
                    onClick={this.onClose}>
                    <span className="icon-close"></span>
                </button>

                <div className="wysiwyg px-2">
                    <ul>
                        {rows}
                    </ul>
                </div>
            </div>
        );
    }
}

export default ValidationError;

