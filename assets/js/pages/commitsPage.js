import React from 'react';
import PropTypes from 'prop-types';
import { Container, Commit, CommitHeader, Spinner } from 'app/components';
import { connectRouter } from 'utils';
import { fetchCommitsIfNeeded } from 'redux/actions/commits';
import commitPropTypes from 'types';


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

  handleRefresh() {
    const { dispatch } = this.props;
    dispatch(fetchCommitsIfNeeded(true));
  }

  render() {
    const { commits, isFetching, lastUpdate } = this.props;
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
      </Container>
    );
  }
}


CommitsPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  commits: PropTypes.arrayOf(commitPropTypes),
  lastUpdate: PropTypes.string,
  isFetching: PropTypes.bool,
};


CommitsPage.defaultProps = {
  commits: [],
  lastUpdate: null,
  isFetching: false,
};


const mapStateToProps = (state) => {
  const { selectedCommits, selectedRepository } = state;
  const {
    isFetching,
    didInvalidate,
    errorMessage,
    commits,
    lastUpdate,
  } = selectedCommits || {
    isFetching: false,
    didInvalidate: false,
    errorMessage: '',
    commits: [],
    lastUpdate: null,
  };

  return {
    isFetching,
    didInvalidate,
    errorMessage,
    selectedRepository,
    commits,
    lastUpdate,
  };
};


export default connectRouter(mapStateToProps, CommitsPage);
