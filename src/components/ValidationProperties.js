import React from 'react';

import StatusBadge from './StatusBadge';

/**
 * Affichage du statut et des informations générales sur la validation
 */
class ValidationProperties extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <table className="table table-striped">
                <tbody>
                    <tr>
                        <td className="col-2 font-weight-bold">Statut</td>
                        <td className="text-left">
                            <StatusBadge status={this.props.validation.status} />
                        </td>
                    </tr>
                    <tr>
                        <td>Modèle</td>
                        <td>
                            <a className="external-link"
                                target="_blank"
                                href={this.props.validation.model}>
                                {this.props.validation.model}
                                <span className="icon-external-link" aria-hidden="true"></span>
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <td>Projection</td>
                        <td>
                            {this.props.validation.srs}
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    }
}

export default ValidationProperties;

