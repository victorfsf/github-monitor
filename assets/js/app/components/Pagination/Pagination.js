import React from 'react';
import PropTypes from 'prop-types';
import PageButton from './PageButton';


const Pagination = props => (
  <nav aria-label="Commits navigation" className="mt-4 mb-5">
    <ul className="pagination justify-content-center">
      <PageButton onClick={() => props.onClickPrev()} disabled={props.prev}>
        Newer
      </PageButton>
      <PageButton onClick={() => props.onClickNext()} disabled={props.next}>
        Older
      </PageButton>
    </ul>
  </nav>
);


Pagination.propTypes = {
  onClickPrev: PropTypes.func.isRequired,
  onClickNext: PropTypes.func.isRequired,
  prev: PropTypes.bool,
  next: PropTypes.bool,
};


Pagination.defaultProps = {
  prev: false,
  next: false,
};


export default Pagination;
