import React from 'react';
import { withRouter } from 'react-router-dom';

import config from '../config';

import deleteValidationById from '../api/deleteValidationById';


/**
 * Affichage des actions possibles sur la validation
 */
class ValidationActions extends React.Component {
    constructor(props) {
        super(props);

        this.onClickDelete = this.onClickDelete.bind(this);
    }

    render() {
        if ( this.props.validation.status !== 'finished' ){
            return null;
        }

        const uid = this.props.validation.uid;

        const csvLink = `${config.validatorApiUrl}/validations/${uid}/results.csv`;
        const sourceLink = `${config.validatorApiUrl}/validations/${uid}/files/source`;
        const normalizedLink = `${config.validatorApiUrl}/validations/${uid}/files/normalized`;

        return (
            <table className="table table-striped">
                <tbody>
                    <tr>
                        <td className="col-2">Actions</td>
                        <td>
                            <a href={csvLink}>Télécharger le rapport au format CSV</a><br />
                            <a href={sourceLink}>Télécharger les fichiers sources</a><br />
                            <a href={normalizedLink}>Télécharger les fichiers normalisés</a><br />

                            <a href="#" onClick={this.onClickDelete}>
                                <span className="icon-trash"></span>
                                Supprimer la validation
                            </a>
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    }

    onClickDelete() {
        if ( ! window.confirm('Confirmer la suppression?') ){
            return false ;
        }
        deleteValidationById(this.props.validation.uid).then(() => {
            this.props.history.push('/');
        }).catch((error) => {
            console.log(error);
        });
    }
}

export default withRouter(ValidationActions);

