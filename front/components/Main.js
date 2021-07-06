import React from 'react';

import {
  HashRouter as Router,
  Switch,
  Route,
  useParams
} from 'react-router-dom';

import Home from './Home';
import About from './About';

/**
 * Application router.
 */
class Main extends React.Component {

  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/about" component={About} />
        </Switch>
      </Router>
    );
  }

}

export default Main;
