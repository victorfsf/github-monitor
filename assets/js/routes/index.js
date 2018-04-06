import HomePage from 'pages/homePage';
import React from 'react';
import { Switch, Route } from 'react-router-dom';


const Routes = () => (
  <Switch>
    <Route exact path="/" component={HomePage} />
  </Switch>
);


export default Routes;
