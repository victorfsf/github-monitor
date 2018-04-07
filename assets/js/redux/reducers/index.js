import { combineReducers } from 'redux';
import { githubCommits, selectedRepository } from 'redux/reducers/github';

const rootReducer = combineReducers({
  githubCommits,
  selectedRepository,
});

export default rootReducer;
