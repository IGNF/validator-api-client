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
            <main className="main" role="main" tabindex="-1">
                <PageTitle title="A propos"/>
                <div class="container-content">
                    <p>Cette application permet de tester IGNF/validator</p>

                    <div className="alert alert-warning" role="alert">
                        Attention, les documents validés par ce démonstrateur ne sont pas forcément valides pour le Géoportail de l'urbanisme, qui réalise des controles supplémentaires.
                    </div>
                </div>
            </main>
        )
    }
}

export default withRouter(About);
