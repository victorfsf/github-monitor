import {
  REQUEST_TOKEN,
  REQUEST_TOKEN_SUCCESS,
  REQUEST_TOKEN_FAIL,
} from 'redux/actions/auth';


const tokens = (state = {
  isFetching: false,
  access: null,
  csrf: null,
  passed: false,
}, action) => {
  switch (action.type) {
    case REQUEST_TOKEN:
      return Object.assign({}, state, {
        isFetching: true,
      });
    case REQUEST_TOKEN_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        access: action.access,
        csrf: action.csrf,
        passed: true,
      });
    case REQUEST_TOKEN_FAIL:
      return Object.assign({}, state, {
        isFetching: false,
        access: null,
        csrf: null,
        passed: false,
      });
    default:
      return state;
  }
};


export default tokens;
