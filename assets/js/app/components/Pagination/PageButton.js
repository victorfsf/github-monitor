import React from 'react';
import PropTypes from 'prop-types';


const PageButton = props => (
  <li className={`page-item ${props.disabled ? 'disabled' : ''}`}>
    <button
      type="button"
      className="page-link"
      onClick={props.onClick}
    >
      {props.children}
    </button>
  </li>
);


PageButton.propTypes = {
  disabled: PropTypes.bool,
  children: PropTypes.node,
  onClick: PropTypes.func.isRequired,
};


PageButton.defaultProps = {
  disabled: false,
  children: null,
};


export default PageButton;
