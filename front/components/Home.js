import React from 'react';

import ValidationForm from './ValidationForm';

/**
 * Configuration de la carte
 */
class Home extends React.Component {
    render() {
        return (
            <div className="home">
                <h1>demo-validator</h1>

                <p>TODO : <ValidationForm /></p>
            </div>
        )
    }
}

export default Home;
