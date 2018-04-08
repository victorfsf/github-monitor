import PropTypes from 'prop-types';


export default PropTypes.shape({
  id: PropTypes.number,
  sha: PropTypes.string,
  message: PropTypes.string,
  date: PropTypes.string,
  url: PropTypes.string,
  author: PropTypes.shape({
    name: PropTypes.name,
    login: PropTypes.login,
    id: PropTypes.number,
    github_id: PropTypes.number,
    avatar: PropTypes.string,
    email: PropTypes.string,
  }),
  repository: PropTypes.string,
});
