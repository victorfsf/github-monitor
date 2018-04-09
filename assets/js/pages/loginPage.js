import React from 'react';
import PropTypes from 'prop-types';
import Routes from 'routes';
import { LoginForm, Spinner } from 'app/components';
import { fetchTokenIfNeeded } from 'redux/actions/auth';
import { Urls } from 'utils';
import { Provider, connect } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';


class LoginPage extends React.Component {

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchTokenIfNeeded());
  }

  render() {
    const { isFetching, passed, store } = this.props;

    if (isFetching) {
      return <Spinner />;
    }
    if (passed) {
      return (
        <Provider store={store}>
          <BrowserRouter>
            <Routes />
          </BrowserRouter>
        </Provider>
      );
    }

    return <LoginForm loginUrl={Urls['oauth:begin']('github')} />;
  }
}

LoginPage.propTypes = {
  isFetching: PropTypes.bool,
  passed: PropTypes.bool,
  dispatch: PropTypes.func.isRequired,
  store: PropTypes.object.isRequired,  // eslint-disable-line react/forbid-prop-types
};


LoginPage.defaultProps = {
  isFetching: false,
  passed: false,
};


const mapStateToProps = (state) => {
  const { tokens } = state;
  const {
    isFetching,
    passed,
  } = tokens || {
    isFetching: false,
    token: null,
  };
  return {
    isFetching,
    passed,
  };
};


export default connect(mapStateToProps)(LoginPage);
