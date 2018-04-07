import DjangoAPI from 'apis/django';


export const REQUEST_ALL_COMMITS = 'REQUEST_ALL_COMMITS';
export const RECEIVE_ALL_COMMITS = 'RECEIVE_ALL_COMMITS';


const requestCommits = () => ({
  type: REQUEST_ALL_COMMITS,
});


const receiveCommits = (commits, nextPage, prevPage) => ({
  type: RECEIVE_ALL_COMMITS,
  commits,
  nextPage,
  prevPage,
  finishedAt: new Date().toISOString(),
});


const fetchCommits = params => (
  (dispatch) => {
    dispatch(requestCommits());
    return DjangoAPI.getCommits(params).then(
      (response) => {
        const next = response.next !== null ? new URL(response.next).search : null;
        const prev = response.previous !== null ? new URL(response.previous).search : null;
        return dispatch(receiveCommits(response.results, next, prev));
      },
    );
  }
);


const shouldFetchCommits = (state) => {
  const request = state.selectedCommits;
  return request.isFinished || !request.isFetching || request.didInvalidate;
};


export const fetchCommitsIfNeeded = (params = null, force = false) => (
  (dispatch, getState) => {
    const state = getState();
    if (force || shouldFetchCommits(state)) {
      return dispatch(fetchCommits(
        params === null ? document.location.search : params,
      ));
    }
    return Promise.resolve(
      dispatch(receiveCommits(state.commits)),
    );
  }
);
