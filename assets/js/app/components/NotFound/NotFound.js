import React from 'react';
import PropTypes from 'prop-types';
import './styles.scss';


const NotFoundPage = props => (
  <div className="justify-content-center">
    <div className="not-found">
      <i className={props.faClassName} />
      <div className="title">
        {props.title}
      </div>
      <div className="description">
        {props.children}
      </div>
    </div>
  </div>
);


NotFoundPage.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  faClassName: PropTypes.string.isRequired,
};


export default NotFoundPage;
