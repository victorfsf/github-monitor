import { combineReducers } from 'redux';
import { commitsByRepo, selectedRepository } from 'redux/reducers/github';

const rootReducer = combineReducers({
  commitsByRepo,
  selectedRepository,
});

export default rootReducer;
