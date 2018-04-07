import GithubAPI from 'apis/github';
import DjangoAPI from 'apis/django';

export const SELECT_REPOSITORY = 'SELECT_REPOSITORY';

export const REQUEST_REPOSITORY = 'REQUEST_REPOSITORY';
export const REQUEST_COMMITS = 'REQUEST_COMMITS';
export const FINISH_REQUEST = 'FINISH_REQUEST';
export const INVALIDATE_REPOSITORY = 'INVALIDATE_REPOSITORY';


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


const finishRequest = repo => ({
  type: FINISH_REQUEST,
  finishedAt: Date.now(),
  repo,
});


const invalidateRepository = (repo, message) => ({
  type: INVALIDATE_REPOSITORY,
  repo,
  message,
});


const createCommits = (dispatch, repo, payload) => (
  DjangoAPI.postRepository(repo, payload.commits).then(
    (response) => {
      if (!response.ok) {
        return dispatch(invalidateRepository(repo, response.message));
      }
      return dispatch(finishRequest(repo));
    },
  )
);


const fetchCommits = repo => (
  (dispatch) => {
    dispatch(requestCommits(repo));
    return GithubAPI.getCommits(repo).then(
      commits => createCommits(dispatch, repo, commits),
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


const shouldCreateCommits = (state, repo) => {
  const commits = state.commitsByRepo[repo];
  if (!commits || commits.isFinished) {
    return true;
  }
  if (commits.isFetching) {
    return false;
  }
  return commits.didInvalidate;
};


export const createCommitsIfNeeded = repo => (
  (dispatch, getState) => {
    if (!repo) {
      return dispatch(invalidateRepository(repo, 'This field is required.'));
    }
    const state = getState();
    if (shouldCreateCommits(state, repo)) {
      return dispatch(fetchRepository(repo));
    }
    const { selectedRepository } = state;
    return Promise.resolve(dispatch(finishRequest(selectedRepository)));
  }
);
