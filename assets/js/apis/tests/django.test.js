import DjangoAPI from 'apis/django';


describe('NavBar', () => {
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
});
