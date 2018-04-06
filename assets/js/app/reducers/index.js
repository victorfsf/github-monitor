import { combineReducers } from 'redux';

// TODO: write actual reducers
const mockedReducer = (state, action) => ({ mock: action });

const rootReducer = combineReducers({
  mockedReducer,
});

export default rootReducer;
