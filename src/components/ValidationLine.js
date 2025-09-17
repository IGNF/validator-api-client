import React, { useState } from 'react';

/**
 * Formulaire de création d'une nouvelle validation.
 */
class ValidationLine extends React.Component {
    constructor(props) {
        super(props);

        this.state = {validation: props.validation};
    }

    render() {
        return (
            <tr>
                <td>{this.state.validation}</td>
            </tr>
        )
    }
}

export default ValidationLine;
