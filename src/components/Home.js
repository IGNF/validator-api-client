import React from 'react';

import FileUploadForm from './FileUploadForm';

class Home extends React.Component {
    render() {
        return (
            <div className="home">
                <FileUploadForm />
            </div>
        )
    }
}

export default Home;
