import React from 'react';
import PropTypes from 'prop-types';
import Box from 'app/components/Box';
import { formatDate } from 'utils';


const CommitHeader = props => (
  <Box>
    <div className="align-middle row">
      <div className="col-10">
        <div className="row">
          <div className="col-12">
            Captured Commits {props.extraHeader}
            <button
              type="button"
              className="btn btn-sm btn-link"
              onClick={props.onClick}
            >
              <i className="fa fa-refresh" />
            </button>
          </div>
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
    </div>
  </Box>
  );


CommitHeader.propTypes = {
  onClick: PropTypes.func.isRequired,
  lastUpdate: PropTypes.string,
  extraHeader: PropTypes.string,
};


CommitHeader.defaultProps = {
  extraHeader: '',
  lastUpdate: null,
};


export default CommitHeader;
