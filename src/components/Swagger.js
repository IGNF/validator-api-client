import React from 'react';
import SwaggerUi from 'swagger-ui';
import 'swagger-ui/dist/swagger-ui.css';
import config from '../config';

class Swagger extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        SwaggerUi({
            dom_id: '#swagger-ui-container',
            url: `${config.validatorSpecsUrl}`,
            presets: [SwaggerUi.presets.apis],
        });
    }

    render() {
        return (
            <main className="main" role="main" tabIndex="-1">
                <div id="swagger-ui-container" />
            </main>
        )
    }
}

export default Swagger;