import React from 'react';
import PropTypes from 'prop-types';
import { commitPropTypes } from 'types';
import { formatDate } from 'utils';
import { GITHUB_URL } from 'constants/github';
import { Link } from 'react-router-dom';
import Box from 'app/components/Box';
import Avatar from './Avatar';
import './styles.scss';


const Commit = (props) => {
  const { payload } = props;
  if (!payload) {
    return <Box />;
  }
  const message = payload.message.split('\n', 1)[0];
  const { author } = payload;
  const userProfileUrl = `${GITHUB_URL}${author.login}`;
  const avatar = <Avatar id={author.github_id} name={author.name} />;

  return (
    <Box>
      <div className="media">
        {author.login ? (
          <a href={`${GITHUB_URL}${author.login}`} target="blank_">
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
                <i className="fa fa-user-o pr-1" />
                {author.name}
              </a>
              <span className="pl-1 text-muted">
                {author.login && `[${author.login}]`}
              </span>
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
              <a href={payload.url} target="blank_">
                {payload.sha}
              </a>
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
