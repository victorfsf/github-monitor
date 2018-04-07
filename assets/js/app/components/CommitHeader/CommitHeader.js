import React from 'react';
import PropTypes from 'prop-types';
import Box from 'app/components/Box';
import { formatDate } from 'utils';


const CommitHeader = props => (
  <Box>
    <div className="align-middle">
      <div className="row">
        <div className="col-sm-12 col-md-6">
          Captured Commits {props.extraHeader}
          <button
            type="button"
            className="btn btn-sm btn-link"
            onClick={props.onClick}
          >
            <i className="fa fa-refresh" />
          </button>
        </div>
        <div className="col-sm-12 col-md-6">
          <small className="float-md-right">
            Count: {props.count} Commits
          </small>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <small className="text-muted">
            Last Update: {
              props.lastUpdate ?
              formatDate(props.lastUpdate) :
              '...'
            }
          </small>
        </div>
      </div>
    </div>
  </Box>
  );


CommitHeader.propTypes = {
  onClick: PropTypes.func.isRequired,
  lastUpdate: PropTypes.string,
  extraHeader: PropTypes.string,
  count: PropTypes.number,
};


CommitHeader.defaultProps = {
  extraHeader: '',
  lastUpdate: null,
  count: 0,
};


export default CommitHeader;
