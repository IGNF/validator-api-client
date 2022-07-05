import React from 'react';
import { withRouter } from 'react-router-dom';
import PageTitle from './PageTitle';

/**
 * Page providing informations
 */
class About extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <main className="main" role="main" tabIndex="-1">
                <PageTitle title="A propos"/>
                <div className="container-content">
                    <div className="wysiwyg">
                        <p className="lead" >Cette application permet de tester IGNF/validator-api.</p>

                        <p>Les modèles proposés sont ceux des documents d'urbanisme provenant du <a href="https://www.geoportail-urbanisme.gouv.fr">Géoportail de l'urbanisme</a>* et un modèle de PCRS (Plan Corps de Rue Simplifié). </p>
                        
                        <p>Ce service ne nécessite aucune authentification et ne collecte donc aucune donnée personnelle.</p>

                        <p>Toutes les validations sont publiques et consultables par quiconque en possède le lien.</p>

                        <p>Les données ne sont pas conservées au delà d'un délai d'un mois sur le serveur, et ce quel que soit le résultat de la validation qui les concerne.</p>

                        <p className="alert alert-warning" role="alert">
                            *Attention, les documents validés par ce démonstrateur ne sont pas forcément valides pour le Géoportail de l'urbanisme, qui réalise des contrôles supplémentaires.
                        </p>
                    </div>
                </div>
            </main>
        )
    }
}

export default withRouter(About);
