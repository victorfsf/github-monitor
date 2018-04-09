import React from 'react';
import HomePage from 'pages/homePage';
import RepositoryPage from 'pages/repositoryPage';
import CommitsPage from 'pages/commitsPage';
import NotFoundPage from 'pages/notFoundPage';
import { Switch, Route } from 'react-router-dom';


const Routes = () => (
  <Switch>
    <Route exact path="/" component={HomePage} />
    <Route exact path="/commits/" component={CommitsPage} />
    <Route exact path="/commits/:owner/:name/" component={RepositoryPage} />
    <Route component={NotFoundPage} />
  </Switch>
);


export default Routes;
