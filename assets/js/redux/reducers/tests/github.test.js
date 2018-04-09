import reducer from 'redux/reducers/github';
import {
  GITHUB_REQUEST_REPOSITORY,
  GITHUB_REQUEST_COMMITS,
  GITHUB_FINISH_REQUEST,
  GITHUB_INVALIDATE_REPOSITORY,
} from 'redux/actions/github';


describe('Github reducers', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({
      isFetching: false,
      didInvalidate: false,
      errorMessage: '',
    });
  });

  it('should handle GITHUB_REQUEST_REPOSITORY', () => {
    expect(
      reducer({}, {
        type: GITHUB_REQUEST_REPOSITORY,
        repo: 'test/test',
      }),
    ).toEqual({
      isFetching: true,
      didInvalidate: false,
      errorMessage: '',
    });
  });

  it('should handle GITHUB_REQUEST_COMMITS', () => {
    expect(
      reducer({
        isFetching: true,
        didInvalidate: false,
        errorMessage: '',
      }, {
        type: GITHUB_REQUEST_COMMITS,
        repo: 'test/test',
      }),
    ).toEqual({
      isFetching: true,
      didInvalidate: false,
      errorMessage: '',
    });
  });

  it('should handle GITHUB_FINISH_REQUEST', () => {
    expect(
      reducer({
        isFetching: true,
        didInvalidate: false,
        errorMessage: '',
      }, {
        type: GITHUB_FINISH_REQUEST,
        repo: 'test/test',
      }),
    ).toEqual({
      isFetching: false,
      didInvalidate: false,
      errorMessage: '',
    });
  });

  it('should handle GITHUB_INVALIDATE_REPOSITORY', () => {
    expect(
      reducer({}, {
        type: GITHUB_INVALIDATE_REPOSITORY,
        repo: 'test/test',
        message: 'error',
      }),
    ).toEqual({
      didInvalidate: true,
      isFetching: false,
      errorMessage: 'error',
    });
  });
});
