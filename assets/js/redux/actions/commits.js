import DjangoAPI from 'apis/django';


export const REQUEST_ALL_COMMITS = 'REQUEST_ALL_COMMITS';
export const RECEIVE_ALL_COMMITS = 'RECEIVE_ALL_COMMITS';


const requestCommits = () => ({
  type: REQUEST_ALL_COMMITS,
});


const receiveCommits = commits => ({
  type: RECEIVE_ALL_COMMITS,
  commits,
  finishedAt: new Date().toISOString(),
});


const fetchCommits = (repo = null) => (
  (dispatch) => {
    dispatch(requestCommits());
    return DjangoAPI.getCommits(repo).then(
      response => dispatch(receiveCommits(response)),
    );
  }
);


const shouldFetchCommits = (state) => {
  const request = state.selectedCommits;
  return request.isFinished || !request.isFetching || request.didInvalidate;
};


export const fetchCommitsIfNeeded = (force = false) => (
  (dispatch, getState) => {
    const state = getState();
    if (force || shouldFetchCommits(state)) {
      return dispatch(fetchCommits());
    }
    return Promise.resolve(
      dispatch(receiveCommits(state.commits)),
    );
  }
);
