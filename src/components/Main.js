import React from 'react';

import {
    HashRouter as Router,
    Redirect,
    Route,
    Switch
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
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route path="/about" component={About} />
                    <Route path="/legal-notice" component={LegalNotice} />
                    <Route path="/api" component={Swagger} />
                    <Redirect path='/validation/' to='/' exact />
                    <Route path="/validation/:uid" component={Validation} />
                </Switch>
                <Footer />
            </Router>
        )
    }
}

export default Main;
