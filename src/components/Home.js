import React from 'react';

import PageTitle from './PageTitle';
import FileUploadForm from './ValidationForm';

class Home extends React.Component {
    render() {
        return (
            <main className="main" role="main" tabIndex="-1">
                <PageTitle title="Validation d'une archive"/>
                <div className="container-content">
                    <FileUploadForm />
                </div>
            </main>
        )
    }
}

export default Home;
