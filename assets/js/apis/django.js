import cookie from 'js-cookie';


class DjangoAPI {

  static postRepository(repo, commits) {
    const [owner, name] = repo.split('/');
    const mappedCommits = commits.map(c => ({
      message: c.commit.message,
      sha: c.sha,
      date: c.commit.author.date,
      url: c.html_url,
      login: c.author ? c.author.login : null,
      author: c.commit.author.name,
    }));
    return fetch(
      '/monitor/repos/', {
        method: 'POST',
        body: JSON.stringify({
          owner,
          name,
          commits: mappedCommits,
        }),
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': cookie('csrftoken'),
        },
      },
    ).then((response) => {
      if (!response.ok) {
        return {
          ok: false,
          message: 'An error occurred, please try again later.',
        };
      }
      return { ok: true };
    });
  }

}


export default DjangoAPI;
