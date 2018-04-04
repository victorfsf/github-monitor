import React from 'react';
import Urls from 'utils/urls';
import './styles.scss';


const NavBar = () => (
  <nav className="navbar navbar-light bg-white">
    <div className="container">
      <a className="navbar-brand" href="">
        <i className="fa fa-2x fa-github align-middle" />
        <span className="align-middle pl-2">
          GitHub Monitor
        </span>
      </a>
      <a className="logout-link" href={Urls['users:logout']()}>
        <i className="fa fa-2x fa-sign-out" />
      </a>
    </div>
  </nav>
);

export default NavBar;
