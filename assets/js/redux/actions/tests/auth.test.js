import * as actions from 'redux/actions/auth';
import DjangoAPI from 'apis/django';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';


const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);


describe('Auth actions', () => {
  it('should result in REQUEST_TOKEN_SUCCESS', () => {
    const store = mockStore({
      tokens: { isFetching: false, access: null, csrf: null },
    });
    const expectedActions = [
      { type: actions.REQUEST_TOKEN },
      { type: actions.REQUEST_TOKEN_SUCCESS, access: '123456', csrf: '654321' },
    ];

    DjangoAPI.getToken = jest.fn().mockReturnValue(
      Promise.resolve({
        access: '123456', csrf: '654321', ok: true,
      }),
    );
    store.dispatch(actions.fetchTokenIfNeeded()).then(
      () => {
        expect(store.getActions()).toMatchObject(expectedActions);
      },
    );
  });

  it('should result in REQUEST_TOKEN_FAIL', () => {
    const store = mockStore({ tokens: {
      isFetching: false, access: null, csrf: null,
    } });
    const expectedActions = [
      { type: actions.REQUEST_TOKEN },
      { type: actions.REQUEST_TOKEN_FAIL },
    ];

    DjangoAPI.getToken = jest.fn().mockReturnValue(
      Promise.resolve({}),
    );
    store.dispatch(actions.fetchTokenIfNeeded()).then(
      () => {
        expect(store.getActions()).toMatchObject(expectedActions);
      },
    );
  });
});
