import React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import Home from 'containers/Home/Home';
import components from './app';

export default () => (
    <Router>
        <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/components" component={components} />
            <Route path="/home" component={Home} />
        </Switch>
    </Router>
);
