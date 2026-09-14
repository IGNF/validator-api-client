import React from 'react';

import {
    HashRouter as Router,
    Navigate,
    Route,
    Routes
} from 'react-router-dom';

import About from './About';
import Footer from './Footer';
import Home from './Home';
import LegalNotice from './LegalNotice';
import Navbar from './Navbar';
import Swagger from './Swagger';
import Validation from './Validation';

/**
 * Application router.
 */
class Main extends React.Component {

    render() {
        return (
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/legal-notice" element={<LegalNotice />} />
                    <Route path="/api" element={<Swagger />} />
                    <Route path="/validation/" element={<Navigate to="/" replace />} />
                    <Route path="/validation/:uid" element={<Validation />} />
                </Routes>
                <Footer />
            </Router>
        )
    }
}

export default Main;
