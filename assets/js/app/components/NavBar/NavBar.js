import React from 'react';
import './styles.scss';


const NavBar = () => (
  <nav className="navbar navbar-light bg-white">
    <div className="container">
      <a className="navbar-brand" href="">
        <span className="">
          <i className="fa fa-2x fa-github" />
        </span>
        <span className="pl-2 my-4">
          GitHub Monitor
        </span>
      </a>
    </div>
  </nav>
);

export default NavBar;
