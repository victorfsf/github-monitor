import React from 'react';
import PropTypes from 'prop-types';
import { NavBar, Box, RepoField, Spinner } from 'app/components';
import Urls from 'utils/urls';
import { connectRouter } from 'utils';
import { fetchCommitsIfNeeded, selectRepository } from 'redux/actions/github';


class HomePage extends React.Component {

  handleSubmit(event) {
    const { dispatch, selectedRepository } = this.props;
    dispatch(fetchCommitsIfNeeded(selectedRepository));
    event.preventDefault();
  }

  handleChange(event) {
    this.props.dispatch(selectRepository(event.target.value));
  }

  render() {
    const {
      selectedRepository, isFetching, didInvalidate, errorMessage,
    } = this.props;
    return (
      <div>
        <NavBar logoutUrl={Urls['users:logout']()} />
        <div className="container">
          <Box>
            <form method="post" onSubmit={e => this.handleSubmit(e)}>
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
        </div>
      </div>
    );
  }
}


HomePage.propTypes = {
  isFetching: PropTypes.bool,
  didInvalidate: PropTypes.bool,
  errorMessage: PropTypes.string,
  selectedRepository: PropTypes.string,
  dispatch: PropTypes.func.isRequired,
};


HomePage.defaultProps = {
  isFetching: false,
  didInvalidate: false,
  selectedRepository: '',
  errorMessage: '',
};


const mapStateToProps = (state) => {
  const { commitsByRepo, selectedRepository } = state;
  const {
    isFetching,
    didInvalidate,
    errorMessage,
  } = commitsByRepo[selectedRepository] || {
    isFetching: false,
    didInvalidate: false,
    errorMessage: '',
    items: [],
  };

  return {
    selectedRepository,
    isFetching,
    didInvalidate,
    errorMessage,
  };
};


export default connectRouter(mapStateToProps, HomePage);
