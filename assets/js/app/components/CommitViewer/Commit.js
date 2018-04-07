import React from 'react';
import PropTypes from 'prop-types';
import Box from 'app/components/Box';
import octocat from 'app/images/github/octocat.png';
import { commitPropTypes } from 'types';
import { formatDate } from 'utils';
import { GITHUB_URL } from 'constants/github';
import { Link } from 'react-router-dom';
import './styles.scss';


const Commit = (props) => {
  const { payload } = props;
  if (!payload) {
    return <Box />;
  }
  const message = payload.message.split('\n', 1)[0];
  const userProfileUrl = `${GITHUB_URL}${payload.login}`;
  const avatar = (
    <img
      src={payload.avatar || octocat}
      className="mr-3 rounded"
      alt={payload.author}
      width="40px"
    />
  );
  return (
    <Box>
      <div className="media">
        {payload.login ? (
          <a href={`${GITHUB_URL}${payload.login}`} target="blank_">
            {avatar}
          </a>
        ) : avatar}
        <div className="media-body">
          <div className="row">
            <div className="col-md-8 col-sm-12">
              <span className="title" title={message}>
                {message}
              </span>
            </div>
            <div className="col-md-4 col-sm-12">
              <small className="float-md-right text-muted">
                {formatDate(payload.date)}
              </small>
            </div>
          </div>
          <small className="row">
            <div className="col-md-8 col-sm-12 pt-xs-2 pt-sm-2 pt-md-0">
              <a href={userProfileUrl} target="blank_">
                {payload.author}
              </a>
              <i className="fa fa-code-fork pl-2 pr-1" />
              {payload.branch}
            </div>
            <div className="col-md-4 col-sm-12 pt-sm-2 pt-md-0">
              <span className="float-md-right">
                <Link to={`/commits/${payload.repository}`}>
                  {payload.repository}
                </Link>
              </span>
            </div>
          </small>
          <small className="row">
            <div className="col-12 pt-sm-2 pt-md-0">
              <i className="fa fa-code pr-1" />
              <a href={payload.url}>{payload.sha}</a>
            </div>
          </small>
        </div>
      </div>
    </Box>
  );
};


Commit.propTypes = {
  payload: PropTypes.shape(commitPropTypes),
};


Commit.defaultProps = {
  payload: null,
};


export default Commit;
