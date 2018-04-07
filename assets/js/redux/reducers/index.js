import { combineReducers } from 'redux';
import selectedCommits from 'redux/reducers/commits';
import githubRequests from 'redux/reducers/github';

const rootReducer = combineReducers({
  githubRequests, selectedCommits,
});

export default rootReducer;
