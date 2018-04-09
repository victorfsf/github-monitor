import reducer from 'redux/reducers/commits';
import { REQUEST_COMMITS, RECEIVE_COMMITS } from 'redux/actions/commits';


describe('Commits reducers', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({
      isFetching: false,
      didInvalidate: false,
      errorMessage: '',
    });
  });

  it('should handle REQUEST_COMMITS', () => {
    expect(
      reducer({}, {
        type: REQUEST_COMMITS,
      }),
    ).toEqual({
      isFetching: true,
      didInvalidate: false,
      errorMessage: '',
      count: 0,
      lastUpdate: null,
    });
  });

  it('should handle RECEIVE_COMMITS', () => {
    expect(
      reducer({}, {
        type: RECEIVE_COMMITS,
        commits: [{
          sha: '1234',
        }, {
          sha: '5678',
        }],
        nextPage: null,
        prevPage: '?page=1',
        count: 10,
        finishedAt: 'today',
      }),
    ).toEqual({
      isFetching: false,
      didInvalidate: false,
      errorMessage: '',
      lastUpdate: 'today',
      commits: [{
        sha: '1234',
      }, {
        sha: '5678',
      }],
      nextPage: null,
      prevPage: '?page=1',
      count: 10,
    });
  });
});
