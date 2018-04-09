import { Urls } from 'utils';
import store from 'store';


class DjangoAPI {

  static mapCommits(commits) {
    return commits.map(c => ({
      message: c.commit.message,
      sha: c.sha,
      date: c.commit.author.date,
      url: c.html_url,
      author: {
        name: c.commit.author.name,
        email: c.commit.author.email,
        login: c.author ? c.author.login : null,
        github_id: c.author ? c.author.id : null,
      },
      branch: c.branch,
    }));
  }

  static getCSRFFromStore() {
    const { tokens } = store.getState();
    return tokens.csrf;
  }

  static getToken() {
    return fetch(
      Urls['users:tokens'](), {
        credentials: 'same-origin',
      },
    ).then(response => response.json());
  }

  static postRepository(repo, commits) {
    const [owner, name] = repo.split('/');
    const token = this.getCSRFFromStore();
    return fetch(
      Urls['monitor:repository-list'](), {
        method: 'POST',
        body: JSON.stringify({
          owner,
          name,
          commits: this.mapCommits(commits),
        }),
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': token,
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
