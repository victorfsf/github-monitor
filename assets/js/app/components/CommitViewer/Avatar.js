import React from 'react';
import PropTypes from 'prop-types';
import { GITHUB_AVATAR_URL } from 'constants/github';


const Avatar = (props) => {
  if (!props.id) {
    return (
      <div className="avatar mr-3 rounded justify-content-center d-flex">
        <i className=" fa fa-github-alt fa-2x align-middle" />
      </div>
    );
  }
  return (
    <img
      src={`${GITHUB_AVATAR_URL}${props.id}?v=4`}
      className="mr-3 rounded"
      alt={props.name}
      width="40px"
    />
  );
};


Avatar.propTypes = {
  id: PropTypes.number,
  name: PropTypes.string.isRequired,
};


Avatar.defaultProps = {
  id: null,
};


export default Avatar;
