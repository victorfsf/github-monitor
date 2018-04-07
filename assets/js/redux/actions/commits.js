import DjangoAPI from 'apis/django';


export const REQUEST_COMMITS = 'REQUEST_COMMITS';
export const RECEIVE_COMMITS = 'RECEIVE_COMMITS';


const requestCommits = () => ({
  type: REQUEST_COMMITS,
});


const receiveCommits = (commits, count, nextPage, prevPage) => ({
  type: RECEIVE_COMMITS,
  commits,
  nextPage,
  prevPage,
  count,
  finishedAt: new Date().toISOString(),
});


const fetchCommits = (params, repo) => (
  (dispatch) => {
    dispatch(requestCommits());
    return DjangoAPI.getCommits(params, repo).then(
      (response) => {
        const next = response.next !== null ? new URL(response.next).search : null;
        const prev = response.previous !== null ? new URL(response.previous).search : null;
        return dispatch(receiveCommits(
          response.results, response.count, next, prev,
        ));
      },
    );
  }
);


const shouldFetchCommits = (state) => {
  const request = state.selectedCommits;
  return request.isFinished || !request.isFetching || request.didInvalidate;
};


export const fetchCommitsIfNeeded = (params = null, force = false, repo) => (
  (dispatch, getState) => {
    const state = getState();
    if (force || shouldFetchCommits(state)) {
      return dispatch(fetchCommits(
        params === null ? document.location.search : params, repo,
      ));
    }
    return Promise.resolve(
      dispatch(receiveCommits(state.commits)),
    );
  }
);
