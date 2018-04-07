import GithubAPI from 'apis/github';
import DjangoAPI from 'apis/django';

export const GITHUB_REQUEST_REPOSITORY = 'REQUEST_REPOSITORY';
export const GITHUB_REQUEST_COMMITS = 'REQUEST_COMMITS';
export const GITHUB_FINISH_REQUEST = 'FINISH_REQUEST';
export const GITHUB_INVALIDATE_REPOSITORY = 'INVALIDATE_REPOSITORY';


export const requestRepository = repo => ({
  type: GITHUB_REQUEST_REPOSITORY,
  repo,
});


const requestCommits = repo => ({
  type: GITHUB_REQUEST_COMMITS,
  repo,
});


const finishRequest = repo => ({
  type: GITHUB_FINISH_REQUEST,
  finishedAt: Date.now(),
  repo,
});


const invalidateRepository = (repo, message) => ({
  type: GITHUB_INVALIDATE_REPOSITORY,
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
        return dispatch(fetchCommits(response.full_name));
      },
    );
  }
);


const shouldCreateCommits = (state) => {
  const request = state.githubRequests;
  return request.isFinished || !request.isFetching || request.didInvalidate;
};


export const createCommitsIfNeeded = repo => (
  (dispatch, getState) => {
    if (!repo) {
      return Promise.resolve(
        dispatch(invalidateRepository(repo, 'This field is required.')),
      );
    }
    const state = getState();
    if (shouldCreateCommits(state, repo)) {
      return dispatch(fetchRepository(repo));
    }
    return Promise.resolve(dispatch(finishRequest()));
  }
);
