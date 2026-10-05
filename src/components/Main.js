import React from 'react';

import {
    BrowserRouter,
    HashRouter,
    Navigate,
    Route,
    Routes
} from 'react-router-dom';

import About from './About';
import Admin from './Admin';
import { AuthProvider } from './AuthContext';
import Footer from './Footer';
import Home from './Home';
import LegalNotice from './LegalNotice';
import LoginError from './LoginError';
import MyValidations from './MyValidations';
import Navbar from './Navbar';
import Swagger from './Swagger';
import Validation from './Validation';

import './Alerts.css';

/**
 * Application router.
 *
 * Uses clean URLs (/validation/xxx) when a basename is given, hash URLs (#/validation/xxx) otherwise.
 */
class Main extends React.Component {

    render() {
        const { basename } = this.props;
        const Router = basename ? BrowserRouter : HashRouter;
        return (
            <Router basename={basename}>
                <AuthProvider>
                    <Navbar />
                    <LoginError />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/legal-notice" element={<LegalNotice />} />
                        <Route path="/api" element={<Swagger />} />
                        <Route path="/validation/" element={<Navigate to="/" replace />} />
                        <Route path="/validation/:uid" element={<Validation />} />
                        <Route path="/validations" element={<MyValidations />} />
                        <Route path="/admin" element={<Admin />} />
                    </Routes>
                    <Footer />
                </AuthProvider>
            </Router>
        )
    }
}

export default Main;
