import {
  REQUEST_ALL_COMMITS,
  RECEIVE_ALL_COMMITS,
} from 'redux/actions/commits';


const selectedCommits = (state = {
  isFetching: false,
  didInvalidate: false,
  isFinished: false,
  errorMessage: '',
}, action) => {
  switch (action.type) {
    case REQUEST_ALL_COMMITS:
      return Object.assign({}, state, {
        isFetching: true,
        didInvalidate: false,
        errorMessage: '',
      });
    case RECEIVE_ALL_COMMITS:
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        isFinished: true,
        errorMessage: '',
        lastUpdate: action.finishedAt,
        commits: action.commits,
      });
    default:
      return state;
  }
};


export default selectedCommits;
