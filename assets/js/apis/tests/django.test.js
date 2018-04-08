import DjangoAPI from 'apis/django';
import Urls from 'utils/urls';

jest.mock('utils/urls', () => ({
  Urls: jest.mock(),
}));

global.fetch = jest.fn();


describe('DjangoAPI', () => {
  test('mapCommits passes', () => {
    const raw = [{
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
    const result = DjangoAPI.mapCommits(raw);
    const expected = [{
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
    const raw = [{
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
    const result = DjangoAPI.mapCommits(raw);
    const expected = [{
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

  test('getCommits without repository', () => {
    Urls['monitor:commit-list'] = jest.fn();
    global.fetch.mockReturnValue(
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ passed: true }),
      }),
    );
    DjangoAPI.getCommits('').then((response) => {
      const calls = Urls['monitor:commit-list'].mock.calls;
      expect(calls.length).toEqual(1);
      expect(calls[0]).toMatchObject([]);
      expect(response.passed).toEqual(true);
    });
  });

  test('getCommits with repository', () => {
    Urls['monitor:commit-repo-list'] = jest.fn();
    const url = Urls['monitor:commit-repo-list'];

    global.fetch.mockReturnValue(
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ passed: true }),
      }),
    );
    DjangoAPI.getCommits('', 'repo-owner/repo-name').then((response) => {
      const calls = url.mock.calls;
      expect(calls.length).toEqual(1);
      expect(calls[0]).toMatchObject(['repo-owner', 'repo-name']);
      expect(response.passed).toEqual(true);
    });
  });
});
