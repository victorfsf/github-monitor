import React from 'react';
import PropTypes from 'prop-types';
import Urls from 'utils/urls';
import NavBar from './NavBar';
import Breadcrumb from './Breadcrumb';


const Container = props => (
  <div>
    <NavBar logoutUrl={Urls['users:logout']()} />
    <Breadcrumb items={props.breadcrumbs} home={props.home} />
    <div className="container">
      {props.children}
    </div>
  </div>
);


Container.propTypes = {
  children: PropTypes.node.isRequired,
  home: PropTypes.bool,
  breadcrumbs: PropTypes.arrayOf(
    PropTypes.shape({
      active: PropTypes.bool,
      name: PropTypes.string,
      link: PropTypes.link,
    }),
  ),
};


Container.defaultProps = {
  breadcrumbs: [],
  home: false,
};


export default Container;
