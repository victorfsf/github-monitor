import React from 'react';
import PropTypes from 'prop-types';
import { Box, RepoField, Spinner, Container } from 'app/components';
import { setBreadcrumbs } from 'redux/actions/breadcrumb';
import { breadcrumbPropTypes } from 'types';
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
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(setBreadcrumbs([{
      active: false,
      name: 'Commits',
      link: '/commits/',
    }]));
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
      isFetching, breadcrumbs,
      didInvalidate, errorMessage,
    } = this.props;
    return (
      <Container breadcrumbs={breadcrumbs} home>
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
  breadcrumbs: PropTypes.arrayOf(breadcrumbPropTypes),
  isFetching: PropTypes.bool,
  didInvalidate: PropTypes.bool,
  errorMessage: PropTypes.string,
  dispatch: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,  // eslint-disable-line react/forbid-prop-types
};


HomePage.defaultProps = {
  breadcrumbs: [],
  isFetching: false,
  didInvalidate: false,
  selectedRepository: '',
  errorMessage: '',
};


const mapStateToProps = (state) => {
  const { githubRequests, breadcrumbList } = state;
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
    breadcrumbs: breadcrumbList,
  };
};


export default connectRouter(mapStateToProps, HomePage);
