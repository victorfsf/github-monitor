import * as actions from 'redux/actions/commits';
import DjangoAPI from 'apis/django';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';


const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);


describe('Auth actions', () => {
  it('should result in RECEIVE_COMMITS', () => {
    const store = mockStore({ selectedCommits: { isFetching: false } });
    const commits = [{ sha: 1 }, { sha: 2 }, { sha: 3 }];
    const expectedActions = [
      { type: actions.REQUEST_COMMITS },
      {
        type: actions.RECEIVE_COMMITS,
        nextPage: '?page=2',
        prevPage: null,
        count: 20,
        finishedAt: 'today',
        commits,
      },
    ];

    Date.toISOString = jest.fn().mockReturnValue('today');

    DjangoAPI.getCommits = jest.fn().mockReturnValue(
      Promise.resolve({
        next: 'http://example.com/?page=2',
        prev: null,
        count: 20,
        results: commits,
      }),
    );
    store.dispatch(actions.fetchCommitsIfNeeded()).then(
      () => {
        expect(store.getActions()).toMatchObject(expectedActions);
      },
    );
  });

  it('should not fetch', () => {
    const store = mockStore({
      selectedCommits: {
        isFetching: true,
      },
    });
    store.dispatch(actions.fetchCommitsIfNeeded()).then(
      () => {
        expect(DjangoAPI.getCommits).not.toHaveBeenCalled();
      },
    );
  });
});
