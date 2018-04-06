import React from 'react';
import PropTypes from 'prop-types';
import { GITHUB_URL } from 'constants';
import './styles.scss';


class RepoForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      repoUrl: '',
    };
  }

  handleChange(event) {
    this.setState({
      repoUrl: event.target.value,
    });
  }

  render() {
    const repoUrl = `${GITHUB_URL}${
      this.state.repoUrl ? this.state.repoUrl :
        'repository-owner/repository-name'
    }`;
    return (
      <form method="post" onSubmit={e => this.props.onSubmit(e)}>
        <div className="input-group">
          <div className="input-group-prepend">
            <span className="input-group-text">
              <i className="fa fa-github-alt" />
            </span>
          </div>
          <input
            name="name"
            type="text"
            className="form-control"
            id="id_name"
            aria-describedby="addRepo"
            placeholder="repository-owner/repository-name"
            autoComplete="off"
            value={this.state.repoUrl}
            onChange={e => this.handleChange(e)}
          />
          <div className="input-group-append">
            <button type="submit" className="btn btn-secondary">
              Submit
            </button>
          </div>
        </div>
        <small className="form-text text-muted">
          Repository URL: <a href={repoUrl}>{repoUrl}</a>
        </small>
      </form>
    );
  }

}

RepoForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default RepoForm;
