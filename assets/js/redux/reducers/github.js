import {
  REQUEST_COMMITS,
  RECEIVE_COMMITS,
  INVALIDATE_REPOSITORY,
  SELECT_REPOSITORY,
  REQUEST_REPOSITORY,
} from 'redux/actions/github';


const commits = (state = {
  isFetching: false,
  didInvalidate: false,
  errorMessage: '',
  items: [],
}, action) => {
  switch (action.type) {
    case REQUEST_REPOSITORY:
      return Object.assign({}, state, {
        didInvalidate: false,
        isFetching: true,
        errorMessage: '',
      });
    case INVALIDATE_REPOSITORY:
      return Object.assign({}, state, {
        didInvalidate: true,
        isFetching: false,
        errorMessage: action.message,
      });
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
        errorMessage: '',
        items: action.commits,
        lastUpdated: action.receivedAt,
      });
    default:
      return state;
  }
};


const commitsByRepo = (state = {}, action) => {
  switch (action.type) {
    case REQUEST_REPOSITORY:
    case INVALIDATE_REPOSITORY:
    case REQUEST_COMMITS:
    case RECEIVE_COMMITS:
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
  commitsByRepo,
  selectedRepository,
};
