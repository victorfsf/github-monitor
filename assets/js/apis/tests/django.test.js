import DjangoAPI from 'apis/django';
import { Urls } from 'utils';

jest.mock('utils/urls', () => ({
  Urls: jest.mock(),
}));


const testDjangoAPI = (args, payload, urlName, expected, calls, fn) => {
  Urls[urlName] = jest.fn();
  const url = Urls[urlName];

  url.mockReturnValue('/test/');
  window.fetch = jest.fn(() => Promise.resolve(
    Object.assign({}, { json: () => expected }, payload),
  ));
  DjangoAPI[fn](...args).then((json) => {
    expect(json).toMatchObject(expected);
  });
  expect(url.mock.calls).toEqual(calls);
};


describe('DjangoAPI', () => {
  let raw;
  let result;
  let expected;

  test('getCommits passes without repo', () => {
    testDjangoAPI(
      [''],
      { ok: true },
      'monitor:commit-list',
      { test: 'passed' },
      [[]],
      'getCommits',
    );
  });

  test('getCommits passes with repo', () => {
    testDjangoAPI(
      ['', 'test/test'],
      { ok: true },
      'monitor:commit-repo-list',
      { test: 'passed' },
      [['test', 'test']],
      'getCommits',
    );
  });

  test('getCommits fails without repo', () => {
    testDjangoAPI(
      [''],
      { ok: false },
      'monitor:commit-list', {
        ok: false,
        message: 'An error occurred, please try again later.',
      },
      [[]],
      'getCommits',
    );
  });

  test('getCommits fails with repo', () => {
    testDjangoAPI(
      ['', 'test/test'],
      { ok: false },
      'monitor:commit-repo-list', {
        ok: false,
        message: 'Repository not found.',
      },
      [['test', 'test']],
      'getCommits',
    );
  });

  test('postRepository passes', () => {
    testDjangoAPI(
      ['test/test', []],
      { ok: true },
      'monitor:repository-list', {
        ok: true,
      },
      [[]],
      'postRepository',
    );
  });

  test('postRepository fails', () => {
    testDjangoAPI(
      ['test/test', []],
      { ok: false },
      'monitor:repository-list', {
        ok: false,
        message: 'An error occurred, please try again later.',
      },
      [[]],
      'postRepository',
    );
  });

  test('mapCommits passes', () => {
    raw = [{
      sha: '1234',
      branch: 'master',
      html_url: 'https://github.com/',
      author: {
        login: 'author',
        id: 1,
      },
      commit: {
        message: 'test',
        author: {
          date: 'today',
          name: 'Author Name',
          email: 'author@example.com',
        },
      },
    }];
    result = DjangoAPI.mapCommits(raw);
    expected = [{
      message: 'test',
      sha: '1234',
      date: 'today',
      url: 'https://github.com/',
      author: {
        name: 'Author Name',
        email: 'author@example.com',
        login: 'author',
        github_id: 1,
      },
      branch: 'master',
    }];
    expect(expected[0]).toMatchObject(result[0]);
  });

  test('mapCommits passes without author', () => {
    raw = [{
      sha: '1234',
      branch: 'master',
      html_url: 'https://github.com/',
      author: null,
      commit: {
        message: 'test',
        author: {
          date: 'today',
          name: 'Author Name',
          email: 'author@example.com',
        },
      },
    }];
    result = DjangoAPI.mapCommits(raw);
    expected = [{
      message: 'test',
      sha: '1234',
      date: 'today',
      url: 'https://github.com/',
      author: {
        name: 'Author Name',
        email: 'author@example.com',
        login: null,
        github_id: null,
      },
      branch: 'master',
    }];
    expect(expected[0]).toMatchObject(result[0]);
  });
});
