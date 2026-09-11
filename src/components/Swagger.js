import React from 'react';
// Lazy-load swagger-ui bundle and css to reduce initial bundle size
import config from '../config';

class Swagger extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        // Dynamically import bundle and css so webpack code-splits them
        Promise.all([
            import('swagger-ui-dist/swagger-ui-bundle.js'),
            import('swagger-ui-dist/swagger-ui.css')
        ]).then(([mod]) => {
            const SwaggerUI = mod.default || mod;
            SwaggerUI({
                dom_id: '#swagger-ui-container',
                url: `${config.validatorSpecsUrl}`,
                presets: [SwaggerUI.presets.apis],
            });
        }).catch(err => {
            console.error('Failed to load Swagger UI bundle', err);
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