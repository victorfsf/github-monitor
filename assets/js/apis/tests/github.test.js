import GithubAPI from 'apis/github';
import { GITHUB_API_URL } from 'constants/github';


const testGithubAPI = (args, payload, expected, fn) => {
  window.fetch = jest.fn(() => Promise.resolve(
    Object.assign({}, { json: () => expected }, payload),
  ));
  GithubAPI[fn](...args).then((json) => {
    expect(json).toMatchObject(expected);
  });
};


describe('GithubAPI', () => {
  test('getUrl without args', () => {
    expect(GithubAPI.getUrl('test/test')).toEqual(
      `${GITHUB_API_URL}test/test?access_token=undefined&`,
    );
  });

  test('getUrl with args', () => {
    expect(GithubAPI.getUrl('test/test', 'sha=8748932473')).toEqual(
      `${GITHUB_API_URL}test/test?access_token=undefined&sha=8748932473`,
    );
  });

  test('getRepository passes', () => {
    testGithubAPI(
      ['test/test'],
      { ok: true },
      { test: 'passed' },
      'getRepository',
    );
  });

  test('getRepository fails', () => {
    testGithubAPI(
      ['test/test'],
      { ok: false },
      { ok: false, message: 'Repository not found.' },
      'getRepository',
    );
  });

  test('getBranches', () => {
    testGithubAPI(
      ['test/test'],
      { ok: true },
      { test: 'passed' },
      'getBranches',
    );
  });
});
