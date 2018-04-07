import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './styles.scss';


const Breadcrumb = props => (
  <nav className="breadcrumb" aria-label="breadcrumb">
    <div className="container">
      {props.items && [{
        name: 'Home',
        link: '/',
        active: props.home,
      }, ...props.items].map((i) => {
        if (i.active) {
          return (
            <span className="breadcrumb-item active" aria-current="page" key={i.name}>
              {i.name}
            </span>
          );
        }
        return (
          <span className="breadcrumb-item" key={i.name}>
            <Link to={i.link}>{i.name}</Link>
          </span>
        );
      })}
    </div>
  </nav>
);


Breadcrumb.propTypes = {
  home: PropTypes.bool,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      active: PropTypes.bool,
      name: PropTypes.string,
      link: PropTypes.link,
    }),
  ),
};


Breadcrumb.defaultProps = {
  items: [],
  home: false,
};


export default Breadcrumb;
