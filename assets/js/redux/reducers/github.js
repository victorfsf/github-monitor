import {
  GITHUB_REQUEST_REPOSITORY,
  GITHUB_REQUEST_COMMITS,
  GITHUB_FINISH_REQUEST,
  GITHUB_INVALIDATE_REPOSITORY,
} from 'redux/actions/github';


const githubRequests = (state = {
  isFetching: false,
  didInvalidate: false,
  isFinished: false,
  errorMessage: '',
}, action) => {
  switch (action.type) {
    case GITHUB_REQUEST_REPOSITORY:
    case GITHUB_REQUEST_COMMITS:
      return Object.assign({}, state, {
        isFetching: true,
        didInvalidate: false,
        errorMessage: '',
      });
    case GITHUB_FINISH_REQUEST:
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        isFinished: true,
        errorMessage: '',
        lastUpdated: action.finishedAt,
      });
    case GITHUB_INVALIDATE_REPOSITORY:
      return Object.assign({}, state, {
        didInvalidate: true,
        isFetching: false,
        errorMessage: action.message,
      });
    default:
      return state;
  }
};


export default githubRequests;
