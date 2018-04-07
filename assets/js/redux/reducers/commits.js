import {
  REQUEST_COMMITS,
  RECEIVE_COMMITS,
} from 'redux/actions/commits';


const selectedCommits = (state = {
  isFetching: false,
  didInvalidate: false,
  isFinished: false,
  errorMessage: '',
}, action) => {
  switch (action.type) {
    case REQUEST_COMMITS:
      return Object.assign({}, state, {
        isFetching: true,
        didInvalidate: false,
        errorMessage: '',
      });
    case RECEIVE_COMMITS:
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        isFinished: true,
        errorMessage: '',
        lastUpdate: action.finishedAt,
        commits: action.commits,
        nextPage: action.nextPage,
        prevPage: action.prevPage,
        count: action.count,
      });
    default:
      return state;
  }
};


export default selectedCommits;
