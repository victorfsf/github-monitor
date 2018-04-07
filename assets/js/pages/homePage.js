import React from 'react';
import PropTypes from 'prop-types';
import { Box, RepoField, Spinner, Container } from 'app/components';
import { connectRouter } from 'utils';
import {
  createCommitsIfNeeded,
  GITHUB_FINISH_REQUEST,
} from 'redux/actions/github';


class HomePage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      repositoryName: '',
      breadcrumbs: [{
        active: false,
        name: 'Commits',
        link: '/commits/',
      }],
    };
  }

  handleSubmit(event) {
    const { dispatch } = this.props;
    event.preventDefault();
    dispatch(createCommitsIfNeeded(this.state.repositoryName)).then(
      action => this.handlePageChange(action),
    );
  }

  handleChange(event) {
    this.setState({
      repositoryName: event.target.value,
    });
  }

  handlePageChange(action) {
    const { history } = this.props;
    if (action.type === GITHUB_FINISH_REQUEST) {
      history.push('/commits/');
    }
  }

  render() {
    const {
      isFetching,
      didInvalidate, errorMessage,
    } = this.props;
    return (
      <Container breadcrumbs={this.state.breadcrumbs} home>
        <Box>
          <form onSubmit={e => this.handleSubmit(e)}>
            <RepoField
              onChange={e => this.handleChange(e)}
              value={this.state.repositoryName}
              isFetching={isFetching}
              hasError={didInvalidate}
              errorMessage={errorMessage}
            />
          </form>
        </Box>
        {isFetching && <Spinner />}
      </Container>
    );
  }
}


HomePage.propTypes = {
  isFetching: PropTypes.bool,
  didInvalidate: PropTypes.bool,
  errorMessage: PropTypes.string,
  dispatch: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,  // eslint-disable-line react/forbid-prop-types
};


HomePage.defaultProps = {
  isFetching: false,
  didInvalidate: false,
  selectedRepository: '',
  errorMessage: '',
};


const mapStateToProps = (state) => {
  const { githubRequests } = state;
  const {
    isFetching,
    didInvalidate,
    errorMessage,
  } = githubRequests || {
    isFetching: false,
    didInvalidate: false,
    errorMessage: '',
  };

  return {
    isFetching,
    didInvalidate,
    errorMessage,
  };
};


export default connectRouter(mapStateToProps, HomePage);
