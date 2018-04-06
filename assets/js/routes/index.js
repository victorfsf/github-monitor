import HomePage from 'pages/homePage';
import CommitsPage from 'pages/commitsPage';
import React from 'react';
import { Switch, Route } from 'react-router-dom';


const Routes = () => (
  <Switch>
    <Route exact path="/" component={HomePage} />
    <Route exact path="/repo/:owner/:name/" component={CommitsPage} />
  </Switch>
);


export default Routes;
