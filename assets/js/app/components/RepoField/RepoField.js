import React from 'react';
import PropTypes from 'prop-types';
import { GITHUB_URL } from 'constants/github';
import './styles.scss';


const RepoField = (props) => {
  const { isFetching, hasError, value, onChange } = props;
  const repoUrl = `${GITHUB_URL}${
    value || 'repository-owner/repository-name'
  }`;
  return (
    <div className="form-group">
      <div className="input-group">
        <div className="input-group-prepend">
          <span className="input-group-text">
            <i className="fa fa-github-alt" />
          </span>
        </div>
        <input
          name="name"
          type="text"
          className={`form-control${hasError ? ' is-invalid' : ''}`}
          id="id_name"
          aria-describedby="addRepo"
          placeholder="repository-owner/repository-name"
          autoComplete="off"
          onChange={onChange}
        />
        <div className="input-group-append">
          <button
            type="submit"
            className="btn btn-info"
            disabled={isFetching}
          >
            Submit
          </button>
        </div>
        {hasError && (
          <div className="invalid-feedback">
            {props.errorMessage}
          </div>
        )}
      </div>
      <small className="form-text text-muted">
        Repository URL:<a href={repoUrl} className="ml-1" target="blank_">{repoUrl}</a>
      </small>
    </div>
  );
};


RepoField.propTypes = {
  value: PropTypes.string,
  errorMessage: PropTypes.string,
  isFetching: PropTypes.bool,
  hasError: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
};

RepoField.defaultProps = {
  value: '',
  errorMessage: '',
  isFetching: false,
  hasError: false,
};

export default RepoField;
