import DjangoAPI from 'apis/django';

export const REQUEST_TOKEN = 'REQUEST_TOKEN';
export const REQUEST_TOKEN_SUCCESS = 'REQUEST_TOKEN_SUCCESS';
export const REQUEST_TOKEN_FAIL = 'REQUEST_TOKEN_FAIL';


const requestToken = () => ({
  type: REQUEST_TOKEN,
});


const requestTokenSuccess = (csrf, access) => ({
  type: REQUEST_TOKEN_SUCCESS,
  csrf,
  access,
});


const requestTokenFail = () => ({
  type: REQUEST_TOKEN_FAIL,
});


const fetchToken = () => (
  (dispatch) => {
    dispatch(requestToken());
    return DjangoAPI.getToken().then(
      (response) => {
        if (!response.ok) {
          return dispatch(requestTokenFail());
        }
        return dispatch(requestTokenSuccess(response.csrf, response.access));
      },
    );
  }
);


const shouldFetchToken = (state) => {
  const tokens = state.tokens;
  return !tokens.csrf || !tokens.access || !tokens.isFetching;
};


export const fetchTokenIfNeeded = () => (
  (dispatch, getState) => {
    if (shouldFetchToken(getState())) {
      return dispatch(fetchToken());
    }
    return null;
  }
);
