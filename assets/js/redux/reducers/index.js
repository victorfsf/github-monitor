import { combineReducers } from 'redux';
import selectedCommits from 'redux/reducers/commits';
import tokens from 'redux/reducers/auth';
import githubRequests from 'redux/reducers/github';
import breadcrumbList from 'redux/reducers/breadcrumb';

const rootReducer = combineReducers({
  githubRequests,
  selectedCommits,
  breadcrumbList,
  tokens,
});

export default rootReducer;
