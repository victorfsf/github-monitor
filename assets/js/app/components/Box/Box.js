import React from 'react';
import PropTypes from 'prop-types';
import './styles.scss';


const Box = props => (
  <div className="my-3 p-3 bg-white rounded box-border">
    {props.children}
  </div>
);

Box.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Box;
