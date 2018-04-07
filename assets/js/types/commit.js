import PropTypes from 'prop-types';


export default PropTypes.shape({
  id: PropTypes.number,
  sha: PropTypes.string,
  message: PropTypes.string,
  date: PropTypes.string,
  url: PropTypes.string,
  author: PropTypes.string,
  repository: PropTypes.string,
  login: PropTypes.string,
  avatar: PropTypes.string,
});
