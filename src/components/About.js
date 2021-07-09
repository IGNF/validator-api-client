import React from 'react';
import { withRouter } from 'react-router-dom';


/**
 * Page providing informations
 */
class About extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <h1>A propos</h1>
                <p>Cette application permet de tester IGNF/validator</p>
            </div>
        )
    }
}

export default withRouter(About);
