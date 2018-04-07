import {
  SELECT_REPOSITORY,
  REQUEST_REPOSITORY,
  REQUEST_COMMITS,
  FINISH_REQUEST,
  INVALIDATE_REPOSITORY,
} from 'redux/actions/github';


const commits = (state = {
  isFetching: false,
  didInvalidate: false,
  isFinished: false,
  errorMessage: '',
}, action) => {
  switch (action.type) {
    case REQUEST_REPOSITORY:
      return Object.assign({}, state, {
        didInvalidate: false,
        isFetching: true,
        errorMessage: '',
      });
    case REQUEST_COMMITS:
      return Object.assign({}, state, {
        isFetching: true,
        didInvalidate: false,
        errorMessage: '',
      });
    case FINISH_REQUEST:
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        isFinished: true,
        errorMessage: '',
        lastUpdated: action.finishedAt,
      });
    case INVALIDATE_REPOSITORY:
      return Object.assign({}, state, {
        didInvalidate: true,
        isFetching: false,
        errorMessage: action.message,
      });
    default:
      return state;
  }
};


const githubRequests = (state = {}, action) => {
  switch (action.type) {
    case REQUEST_REPOSITORY:
    case INVALIDATE_REPOSITORY:
    case REQUEST_COMMITS:
    case FINISH_REQUEST:
      return Object.assign({}, state, {
        [action.repo]: commits(state[action.repo], action),
      });
    default:
      return state;
  }
};


const selectedRepository = (state = null, action) => {
  switch (action.type) {
    case SELECT_REPOSITORY:
      return action.repo;
    default:
      return state;
  }
};


export {
  githubRequests,
  selectedRepository,
};
