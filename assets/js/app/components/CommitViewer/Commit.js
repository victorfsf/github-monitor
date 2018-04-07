import React from 'react';
import PropTypes from 'prop-types';
import Box from 'app/components/Box';
import octocat from 'app/images/github/octocat.png';
import { commitPropTypes } from 'types';
import { formatDate } from 'utils';
import { GITHUB_URL } from 'constants/github';
import { Link } from 'react-router-dom';


const Commit = (props) => {
  const { payload } = props;
  const message = payload.message.split('\n', 1)[0];
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
            <div className="col-8">
              <h6 title={message}>
                {message}
              </h6>
            </div>
            <div className="col-4">
              <small className="pull-right text-muted">
                {formatDate(payload.date)}
              </small>
            </div>
          </div>
          <small className="row">
            <div className="col-8">
              {payload.author}
              <i className="fa fa-code-fork px-2" />
              {payload.branch}
              <i className="fa fa-angle-right px-2" />
              <a href={payload.url}>{payload.sha}</a>
            </div>
            <div className="col-4">
              <span className="pull-right">
                <Link to={`/commits/${payload.repository}`}>
                  {payload.repository}
                </Link>
              </span>
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
