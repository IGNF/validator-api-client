import React from 'react';

import FileUploadForm from './ValidationForm';

class Home extends React.Component {
    render() {
        return (
            <div>
                <h1>Validator</h1>
                <FileUploadForm />
            </div>
        )
    }
}

export default Home;
