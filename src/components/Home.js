import React from 'react';

import FileUploadForm from './ValidationForm';

class Home extends React.Component {
    render() {
        return (
            <div>
                <h1>Validation d'une archive</h1>
                <FileUploadForm />
            </div>
        )
    }
}

export default Home;
