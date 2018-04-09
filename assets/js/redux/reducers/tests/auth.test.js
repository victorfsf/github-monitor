import reducer from 'redux/reducers/auth';
import {
  REQUEST_TOKEN,
  REQUEST_TOKEN_SUCCESS,
  REQUEST_TOKEN_FAIL,
} from 'redux/actions/auth';


describe('Auth reducers', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({
      isFetching: false,
      access: null,
      csrf: null,
      passed: false,
    });
  });

  it('should handle REQUEST_TOKEN', () => {
    expect(
      reducer({
        isFetching: false,
        access: null,
        csrf: null,
        passed: false,
      }, {
        type: REQUEST_TOKEN,
      }),
    ).toEqual({
      isFetching: true,
      access: null,
      csrf: null,
      passed: false,
    });
  });

  it('should handle REQUEST_TOKEN_SUCCESS', () => {
    expect(
      reducer({
        isFetching: true,
        access: null,
        csrf: null,
        passed: false,
      }, {
        type: REQUEST_TOKEN_SUCCESS,
        access: '1234',
        csrf: '4321',
      }),
    ).toEqual({
      isFetching: false,
      access: '1234',
      csrf: '4321',
      passed: true,
    });
  });

  it('should handle REQUEST_TOKEN_FAIL', () => {
    expect(
      reducer({
        isFetching: true,
        access: null,
        csrf: null,
        passed: false,
      }, {
        type: REQUEST_TOKEN_FAIL,
      }),
    ).toEqual({
      isFetching: false,
      access: null,
      csrf: null,
      passed: false,
    });
  });
});
