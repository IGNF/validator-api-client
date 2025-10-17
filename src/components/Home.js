import React from 'react';

import PageTitle from './PageTitle';
import FileUploadForm from './ValidationForm';
import Dashboard from './Dashboard.js';

class Home extends React.Component {
    render() {
        return (
            <main className="main" role="main" tabIndex="-1">
                <PageTitle title="Validation d'une archive"/>
                <div className="row">
                    <div className="col-sm-12">
                        <FileUploadForm />
                    </div>
                    {/* <div className="col-sm-6">
                        <Dashboard />
                    </div> */}
                </div>
            </main>
        )
    }
}

export default Home;
