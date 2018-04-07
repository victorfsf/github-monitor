import cookie from 'js-cookie';
import { Urls } from 'utils';


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
      avatar: c.author ? c.author.avatar_url : null,
      branch: c.branch,
    }));
    return fetch(
      Urls['monitor:repository-list'](), {
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

  static getCommits(params, repo = null) {
    let url;
    if (repo) {
      url = Urls['monitor:commit-repo-list'](...repo.split('/'));
    } else {
      url = Urls['monitor:commit-list']();
    }
    return fetch(
      `${url}${params}`, {
        credentials: 'same-origin',
      },
    ).then(
      (response) => {
        if (!response.ok) {
          return {
            ok: false,
            message: (
              repo ? 'Repository not found.' : 'An error occurred, please try again later.'
            ),
          };
        }
        return response.json();
      },
    );
  }

}


export default DjangoAPI;
