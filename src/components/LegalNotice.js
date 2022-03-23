import React from 'react';
import { withRouter } from 'react-router-dom';
import PageTitle from './PageTitle';

/**
 * Page providing informations
 */
class LegalNotice extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const url = "demo-validator.ign.fr";
        return (
            <main className="main" role="main" tabIndex="-1">
                <PageTitle title="Mentions légales"/>
                <div className="container-content container-content--smaller">
                    <div className="wysiwyg">
                        <h3>Editeur</h3>

                        <p>Le site {url} est édité par l’Institut national de l’information géographique et forestière (IGN), 73 avenue de Paris, 94165 SAINT-MANDE CEDEX, France.</p>

                        <p>Tél : 01 43 98 80 00.</p>

                        <p>Directeur de la publication : Sébastien Soriano, Directeur général de l'IGN.</p>
                    
                        <h3>Hébergeur</h3>

                        <p>Le site {url} est hébergé par Cegedim S.A., 137 rue d'Aguesseau, 92641 Boulogne-Billancourt Cedex, France.</p>

                        <h3>Droit de propriété intellectuelle</h3>

                        <p>Les illustrations, le contenu éditorial et les divers éléments de la charte graphique sont des éléments dont l’IGN détient la propriété ou le droit d’exploitation.</p>

                        <p>L’utilisation des documents ou éléments du site est soumise à l’accord préalable de notre établissement.</p>
                    
                        <h3>Liens hypertextes proposés sur {url}</h3>

                        <p>Les liens insérés dans les pages du site {url} vers des sites tiers sont proposés à titre d’information ; le contenu des sites vers lesquels ces liens conduisent n’engage pas la responsabilité de l’éditeur.</p>
                    </div>
                </div>
            </main>
        )
    }
}

export default withRouter(LegalNotice);
