import React from 'react';
import { NavBar } from 'app/components';
import Urls from 'utils/urls';

const HomePage = () => (
  <NavBar logoutUrl={Urls['users:logout']()} />
);

export default HomePage;
