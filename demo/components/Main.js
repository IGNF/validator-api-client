import React from 'react';

import {
    HashRouter as Router,
    Switch,
    Route,
    useParams
} from 'react-router-dom';

import Home from './Home';
import About from './About';
import Navbar from './Navbar';

const routes = [
    {
        path: "/",
        exact: true,
        component: Home,
        nav: "Accueil"
    },
    {
        path: "/about",
        component: About,
        nav: "A propos"
    }
];

/**
 * Application router.
 */
class Main extends React.Component {

    render() {
        return (
            <Router>
                <Navbar routes={routes} />
                <Switch>
                    {routes.map((route, index) => (
                        <Route key={index}
                            exact={route.exact}
                            path={route.path}
                            component={route.component}
                        />
                    ))}
                </Switch>
            </Router>
        );
    }

}

export default Main;
