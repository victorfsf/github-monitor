import { GITHUB_API_URL } from 'constants/github';
import { filterDuplicates } from 'utils';
import cookie from 'js-cookie';
import moment from 'moment';


const injectBranch = (branch, commits) => (
  commits.map(commit => Object.assign({}, { branch: branch.name }, commit))
);


class GithubAPI {

  static getUrl(path, args = '') {
    return `${GITHUB_API_URL}${path}?access_token=${cookie('accesstoken')}&${args}`;
  }

  static getRepository(repo) {
    return fetch(
      this.getUrl(`repos/${repo}`),
    ).then((response) => {
      if (!response.ok) {
        return {
          ok: false,
          message: 'Repository not found.',
        };
      }
      return response.json();
    });
  }

  static getBranches(repo) {
    return fetch(
      this.getUrl(`repos/${repo}/branches`),
    ).then(response => response.json());
  }

  static getCommits(repo) {
    const lastMonth = moment().subtract(1, 'months').startOf('day').toISOString();
    return this.getBranches(repo).then(
      branches => Promise.all(
        branches.map(
          branch => (
            fetch(
              this.getUrl(`repos/${repo}/commits`, `sha=${branch.name}&since=${lastMonth}`),
            ).then(response => response.json()).then(
              commits => injectBranch(branch, commits),
            )
          ),
        ),
      ).then((responses) => {
        const commits = filterDuplicates([].concat(...responses), 'sha');
        return { ok: true, commits };
      }),
    );
  }

}


export default GithubAPI;
