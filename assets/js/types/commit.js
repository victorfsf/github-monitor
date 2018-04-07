import PropTypes from 'prop-types';


export default PropTypes.shape({
  id: PropTypes.number.isRequired,
  sha: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  repository: PropTypes.string.isRequired,
  login: PropTypes.string,
  avatar: PropTypes.string,
});
