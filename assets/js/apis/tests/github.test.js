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
      `${GITHUB_API_URL}test/test?access_token=null&`,
    );
  });

  test('getUrl with args', () => {
    expect(GithubAPI.getUrl('test/test', 'sha=8748932473')).toEqual(
      `${GITHUB_API_URL}test/test?access_token=null&sha=8748932473`,
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

  test('getCommits', () => {
    GithubAPI.getBranches = jest.fn().mockReturnValue(
      Promise.resolve([
        { name: 'staging' },
        { name: 'master' },
      ]),
    );
    window.fetch = jest.fn().mockReturnValueOnce(Promise.resolve({
      json: () => [
        { sha: 1 }, { sha: 1 },
        { sha: 2 }, { sha: 3 },
      ],
    })).mockReturnValueOnce(Promise.resolve({
      json: () => [
        { sha: 4 }, { sha: 4 }, { sha: 4 },
        { sha: 5 }, { sha: 5 },
        { sha: 6 }, { sha: 6 },
      ],
    }));
    GithubAPI.getCommits('test/test').then(
      (response) => {
        expect(response).toMatchObject({
          ok: true,
          commits: [
            { branch: 'staging', sha: 1 },
            { branch: 'staging', sha: 2 },
            { branch: 'staging', sha: 3 },
            { branch: 'master', sha: 4 },
            { branch: 'master', sha: 5 },
            { branch: 'master', sha: 6 },
          ],
        });
      },
    );
  });
});
