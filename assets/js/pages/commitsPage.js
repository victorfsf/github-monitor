import React from 'react';
import PropTypes from 'prop-types';
import { connectRouter } from 'utils';
import { fetchCommitsIfNeeded } from 'redux/actions/commits';
import commitPropTypes from 'types';
import {
  Container,
  Commit,
  CommitHeader,
  Spinner,
  Pagination,
} from 'app/components';


class CommitsPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      breadcrumbs: [{
        active: true,
        name: 'Commits',
        link: '/commits/',
      }],
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchCommitsIfNeeded());
  }

  onClickPrev() {
    const { dispatch, prevPage, history } = this.props;
    dispatch(fetchCommitsIfNeeded(prevPage, true));
    history.push({ search: prevPage });
  }

  onClickNext() {
    const { dispatch, nextPage, history } = this.props;
    dispatch(fetchCommitsIfNeeded(nextPage, true));
    history.push({ search: nextPage });
  }

  handleRefresh() {
    const { dispatch } = this.props;
    dispatch(fetchCommitsIfNeeded(document.location.search, true));
  }

  render() {
    const {
      commits, isFetching, lastUpdate, prevPage, nextPage,
    } = this.props;
    return (
      <Container breadcrumbs={this.state.breadcrumbs}>
        <CommitHeader
          onClick={e => this.handleRefresh(e)}
          lastUpdate={lastUpdate}
        />
        {
          isFetching ? <Spinner /> : commits && commits.map(commit => (
            <Commit key={commit.id} payload={commit} />
          ))
        }
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


CommitsPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,  // eslint-disable-line react/forbid-prop-types
  commits: PropTypes.arrayOf(commitPropTypes),
  lastUpdate: PropTypes.string,
  isFetching: PropTypes.bool,
  nextPage: PropTypes.string,
  prevPage: PropTypes.string,
};


CommitsPage.defaultProps = {
  commits: [],
  lastUpdate: null,
  isFetching: false,
  nextPage: null,
  prevPage: null,
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
  } = selectedCommits || {
    isFetching: false,
    didInvalidate: false,
    errorMessage: '',
    commits: [],
    lastUpdate: null,
    nextPage: null,
    prevPage: null,
  };

  return {
    isFetching,
    didInvalidate,
    errorMessage,
    commits,
    lastUpdate,
    nextPage,
    prevPage,
  };
};


export default connectRouter(mapStateToProps, CommitsPage);
