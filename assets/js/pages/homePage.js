import React from 'react';
import PropTypes from 'prop-types';
import { Box, RepoField, Spinner, Container } from 'app/components';
import { connectRouter } from 'utils';
import {
  createCommitsIfNeeded,
  selectRepository,
  FINISH_REQUEST,
} from 'redux/actions/github';


class HomePage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      breadcrumbs: [{
        active: false,
        name: 'Commits',
        link: '/commits/',
      }],
    };
  }

  handleSubmit(event) {
    const { dispatch, selectedRepository } = this.props;
    event.preventDefault();
    dispatch(createCommitsIfNeeded(selectedRepository)).then(
      action => this.handlePageChange(action),
    );
  }

  handleChange(event) {
    this.props.dispatch(selectRepository(event.target.value));
  }

  handlePageChange(action) {
    const { dispatch, history } = this.props;
    if (action.type === FINISH_REQUEST) {
      dispatch(selectRepository(null));
      history.push('/commits/');
    }
  }

  render() {
    const {
      selectedRepository, isFetching,
      didInvalidate, errorMessage,
    } = this.props;
    return (
      <Container breadcrumbs={this.state.breadcrumbs} home>
        <Box>
          <form onSubmit={e => this.handleSubmit(e)}>
            <RepoField
              onChange={e => this.handleChange(e)}
              value={selectedRepository}
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
  selectedRepository: PropTypes.string,
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
  const { githubCommits, selectedRepository } = state;
  const {
    isFetching,
    didInvalidate,
    errorMessage,
  } = githubCommits[selectedRepository] || {
    isFetching: false,
    didInvalidate: false,
    errorMessage: '',
  };

  return {
    selectedRepository,
    isFetching,
    didInvalidate,
    errorMessage,
  };
};


export default connectRouter(mapStateToProps, HomePage);
