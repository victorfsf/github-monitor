import * as actions from 'redux/actions/github';
import DjangoAPI from 'apis/django';
import GithubAPI from 'apis/github';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';


const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);


describe('Auth actions', () => {
  it('should result in GITHUB_FINISH_REQUEST', () => {
    const store = mockStore({ githubRequests: { isFetching: false } });
    const repo = 'test/test';
    const expectedActions = [
      { type: actions.GITHUB_REQUEST_REPOSITORY, repo },
      { type: actions.GITHUB_REQUEST_COMMITS, repo },
      { type: actions.GITHUB_FINISH_REQUEST, repo },
    ];

    GithubAPI.getRepository = jest.fn().mockReturnValue(
      Promise.resolve({
        full_name: repo,
      }),
    );

    GithubAPI.getCommits = jest.fn().mockReturnValue(
      Promise.resolve({
        commits: [],
      }),
    );

    DjangoAPI.postRepository = jest.fn().mockReturnValue(
      Promise.resolve({
        commits: [],
        ok: true,
      }),
    );

    store.dispatch(actions.createCommitsIfNeeded(repo)).then(
      () => {
        expect(store.getActions()).toMatchObject(expectedActions);
      },
    );
  });

  it('should result in GITHUB_INVALIDATE_REPOSITORY when repo is null', () => {
    const store = mockStore({ githubRequests: { isFetching: false } });
    const expectedActions = [
      {
        type: actions.GITHUB_INVALIDATE_REPOSITORY,
        message: 'This field is required.',
        repo: undefined,
      },
    ];

    store.dispatch(actions.createCommitsIfNeeded()).then(
      () => {
        expect(store.getActions()).toMatchObject(expectedActions);
      },
    );
  });

  it('should result in GITHUB_INVALIDATE_REPOSITORY when repo is invalid', () => {
    const store = mockStore({ githubRequests: { isFetching: false } });
    const repo = 'test/test';
    const expectedActions = [
      { type: actions.GITHUB_REQUEST_REPOSITORY, repo },
      {
        type: actions.GITHUB_INVALIDATE_REPOSITORY,
        message: 'Repository not found.',
        repo,
      },
    ];

    GithubAPI.getRepository = jest.fn().mockReturnValue(
      Promise.resolve({
        ok: false,
        message: 'Repository not found.',
      }),
    );

    store.dispatch(actions.createCommitsIfNeeded(repo)).then(
      () => {
        expect(store.getActions()).toMatchObject(expectedActions);
      },
    );
  });

  it('should result in GITHUB_INVALIDATE_REPOSITORY', () => {
    const store = mockStore({ githubRequests: { isFetching: false } });
    const repo = 'test/test';
    const expectedActions = [
      { type: actions.GITHUB_REQUEST_REPOSITORY, repo },
      { type: actions.GITHUB_REQUEST_COMMITS, repo },
      {
        type: actions.GITHUB_INVALIDATE_REPOSITORY,
        message: 'An error occurred, please try again later.',
        repo,
      },
    ];

    GithubAPI.getRepository = jest.fn().mockReturnValue(
      Promise.resolve({
        full_name: repo,
      }),
    );

    DjangoAPI.postRepository = jest.fn().mockReturnValue(
      Promise.resolve({
        ok: false,
        message: 'An error occurred, please try again later.',
      }),
    );

    store.dispatch(actions.createCommitsIfNeeded(repo)).then(
      () => {
        expect(store.getActions()).toMatchObject(expectedActions);
      },
    );
  });

  it('should not fetch', () => {
    const repo = 'test/test';
    const store = mockStore({
      githubRequests: {
        isFetching: true,
      },
    });
    store.dispatch(actions.createCommitsIfNeeded(repo)).then(
      () => {
        expect(GithubAPI.getRepository).not.toHaveBeenCalled();
      },
    );
  });
});
