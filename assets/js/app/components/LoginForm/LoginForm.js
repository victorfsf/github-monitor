import React from 'react';
import PropTypes from 'prop-types';
import './styles.scss';


const LoginForm = props => (
  <div className="login">
    <div className="col-lg-4 col-md-6 col-sm-8 col-xs-12 col-centered">
      <div className="login-box">
        <div className="logo-container">
          <i className="fa fa-4x fa-github" />
          <div className="title">
            Github Monitor
          </div>
          <div className="description">
            {"Monitor your repositories' commits"}
          </div>
        </div>
        <a href={props.loginUrl} className="btn btn-dark">
          <i className="fa fa-2x fa-github-alt align-middle" />
          <span className="align-middle pl-2">
            Sign in with Github
          </span>
        </a>
      </div>
    </div>
  </div>
);

LoginForm.propTypes = {
  loginUrl: PropTypes.string.isRequired,
};

export default LoginForm;
