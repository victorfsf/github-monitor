import React from 'react';
import PropTypes from 'prop-types';
import octocat from 'app/images/github/octocat.png';
import { GITHUB_AVATAR_URL } from 'constants/github';


const Avatar = props => (
  <img
    src={props.id ? `${GITHUB_AVATAR_URL}${props.id}?v=4` : octocat}
    className="mr-3 rounded"
    alt={props.name}
    width="40px"
  />
);


Avatar.propTypes = {
  id: PropTypes.number,
  name: PropTypes.string.isRequired,
};


Avatar.defaultProps = {
  id: null,
};


export default Avatar;
