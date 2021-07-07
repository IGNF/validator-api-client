import React from 'react';
import { withRouter, useParams } from 'react-router-dom';


/**
 * Page providing informations
 */
class Validation extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {

        var id = this.props.match.params.id;

        return (
            <div className="config">
                <h1>Validation {id}</h1>
            </div>
        )
    }

}

export default withRouter(Validation);