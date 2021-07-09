import React from 'react';

import {
    HashRouter as Router,
    Switch,
    Route
} from 'react-router-dom';

import Navbar from './Navbar';
import Home from './Home';
import About from './About';
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
                    <Route path="/validation/:uid" component={Validation} />
                </Switch>
            </Router>
        )
    }
}

export default Main;
