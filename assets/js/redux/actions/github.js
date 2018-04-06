import GithubAPI from 'apis/github';
import DjangoAPI from 'apis/django';

export const REQUEST_REPOSITORY = 'REQUEST_REPOSITORY';
export const REQUEST_COMMITS = 'REQUEST_COMMITS';
export const RECEIVE_COMMITS = 'RECEIVE_COMMITS';
export const INVALIDATE_REPOSITORY = 'INVALIDATE_REPOSITORY';
export const SELECT_REPOSITORY = 'SELECT_REPOSITORY';


export const selectRepository = repo => ({
  type: SELECT_REPOSITORY,
  repo,
});

export const requestRepository = repo => ({
  type: REQUEST_REPOSITORY,
  repo,
});


const requestCommits = repo => ({
  type: REQUEST_COMMITS,
  repo,
});


const receiveCommits = (repo, commits) => ({
  type: RECEIVE_COMMITS,
  receivedAt: Date.now(),
  commits,
  repo,
});


const invalidateRepository = (repo, message) => ({
  type: INVALIDATE_REPOSITORY,
  repo,
  message,
});


const postCommits = (dispatch, repo, payload) => (
  DjangoAPI.postRepository(repo, payload.commits).then(
    (response) => {
      if (!response.ok) {
        return dispatch(invalidateRepository(repo, response.message));
      }
      return dispatch(receiveCommits(repo, response.commits));
    },
  )
);


const fetchCommits = repo => (
  (dispatch) => {
    dispatch(requestCommits(repo));
    return GithubAPI.getCommits(repo).then(
      commits => postCommits(dispatch, repo, commits),
    );
  }
);


const fetchRepository = repo => (
  (dispatch) => {
    dispatch(requestRepository(repo));
    return GithubAPI.getRepository(repo).then(
      (response) => {
        if (response.ok === false) {
          return dispatch(invalidateRepository(repo, response.message));
        }
        const fullName = response.full_name;
        dispatch(selectRepository(fullName));
        return dispatch(fetchCommits(fullName));
      },
    );
  }
);


const shouldFetchCommits = (state, repo) => {
  const commits = state.commitsByRepo[repo];
  if (!commits) {
    return true;
  }
  if (commits.isFetching) {
    return false;
  }
  return commits.didInvalidate;
};


export const fetchCommitsIfNeeded = repo => (
  (dispatch, getState) => {
    if (!repo) {
      return dispatch(invalidateRepository(repo, 'This field is required.'));
    }
    if (shouldFetchCommits(getState(), repo)) {
      return dispatch(fetchRepository(repo));
    }
    return null;
  }
);
