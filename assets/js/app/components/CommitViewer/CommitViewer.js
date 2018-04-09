import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { commitPropTypes, breadcrumbPropTypes } from 'types';
import { fetchCommitsIfNeeded } from 'redux/actions/commits';
import { Container, Pagination } from 'app/components';
import CommitList from './CommitList';
import CommitHeader from './CommitHeader';


class CommitViewer extends React.Component {

  componentDidMount() {
    const { dispatch, repo } = this.props;
    dispatch(fetchCommitsIfNeeded(null, false, repo));
  }

  onClickPrev() {
    const { dispatch, prevPage, history, repo } = this.props;
    dispatch(fetchCommitsIfNeeded(prevPage, true, repo));
    history.push({ search: prevPage });
  }

  onClickNext() {
    const { dispatch, nextPage, history, repo } = this.props;
    dispatch(fetchCommitsIfNeeded(nextPage, true, repo));
    history.push({ search: nextPage });
  }

  handleRefresh() {
    const { dispatch, repo } = this.props;
    dispatch(fetchCommitsIfNeeded(null, true, repo));
  }

  render() {
    const {
      commits, isFetching, lastUpdate,
      prevPage, nextPage, breadcrumbs,
      count, repo,
    } = this.props;
    return (
      <Container breadcrumbs={breadcrumbs}>
        <CommitHeader
          onClick={e => this.handleRefresh(e)}
          lastUpdate={lastUpdate}
          count={count}
          repo={repo}
        />
        <CommitList items={commits} isFetching={isFetching} />
        <Pagination
          onClickNext={() => this.onClickNext()}
          onClickPrev={() => this.onClickPrev()}
          next={nextPage == null}
          prev={prevPage == null}
        />
      </Container>
    );
  }
}


CommitViewer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  history: PropTypes.object,  // eslint-disable-line react/forbid-prop-types
  commits: PropTypes.arrayOf(commitPropTypes),
  lastUpdate: PropTypes.string,
  isFetching: PropTypes.bool,
  nextPage: PropTypes.string,
  prevPage: PropTypes.string,
  count: PropTypes.number,
  repo: PropTypes.string,
  breadcrumbs: PropTypes.arrayOf(breadcrumbPropTypes),
};


CommitViewer.defaultProps = {
  commits: [],
  history: null,
  breadcrumbs: [],
  lastUpdate: null,
  isFetching: false,
  nextPage: null,
  prevPage: null,
  count: 0,
  repo: '',
};


const mapStateToProps = (state) => {
  const { selectedCommits } = state;
  const {
    isFetching,
    didInvalidate,
    errorMessage,
    commits,
    lastUpdate,
    nextPage,
    prevPage,
    count,
  } = selectedCommits || {
    isFetching: false,
    didInvalidate: false,
    errorMessage: '',
    commits: [],
    lastUpdate: null,
    nextPage: null,
    prevPage: null,
    count: 0,
  };

  return {
    isFetching,
    didInvalidate,
    errorMessage,
    commits,
    lastUpdate,
    nextPage,
    prevPage,
    count,
  };
};


export default connect(mapStateToProps)(CommitViewer);
