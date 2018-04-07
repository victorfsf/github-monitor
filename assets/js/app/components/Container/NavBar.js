import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './styles.scss';


const NavBar = props => (
  <nav className="navbar navbar-dark bg-dark">
    <div className="container">
      <Link className="navbar-brand" to="/">
        <i className="fa fa-2x fa-github align-middle" />
        <span className="align-middle pl-2">
          Github Monitor
        </span>
      </Link>
      <a className="logout-link" href={props.logoutUrl}>
        <i className="fa fa-sign-out" /> Logout
      </a>
    </div>
  </nav>
);

NavBar.propTypes = {
  logoutUrl: PropTypes.string.isRequired,
};

export default NavBar;
