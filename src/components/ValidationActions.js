import React from 'react';
import { withRouter } from 'react-router-dom';

import config from '../config';

import deleteValidationById from '../api/deleteValidationById';
import downloadValidationById from '../api/downloadValidationById';

/**
 * Affichage des actions possibles sur la validation
 */
class ValidationActions extends React.Component {
    constructor(props) {
        super(props);

        this.onClickDelete = this.onClickDelete.bind(this);
    }

    render() {
        if ( this.props.validation.status !== 'archived' ){
            return null;
        }

        const uid = this.props.validation.uid;

        return (
            <table className="table table-striped">
                <tbody>
                    <tr>
                        <td className="col-2">Actions</td>
                        <td>
                            <a href="#" onClick={this.onClickDelete}>
                                Supprimer le rapport de validation
                            </a>
                        </td>
                        <td>
                            <a href="#" onClick={this.onClickDownloadCSV(uid)}>
                                Télécharger le rapport de validation en csv
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

    onClickDownloadCSV(uid) {
        return () => {
            downloadValidationById(uid)
                .then((blob) => {
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.style.display = 'none';
                    a.href = url;

                    a.download = 'results.csv';
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                })
                .catch((error) => {
                    console.log("error")
                    console.log(error);
            });
        }
    }
}

export default withRouter(ValidationActions);

