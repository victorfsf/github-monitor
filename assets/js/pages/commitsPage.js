import React from 'react';
// import PropTypes from 'prop-types';
import { NavBar, Box } from 'app/components';
import Urls from 'utils/urls';
import { connectRouter } from 'utils';


class CommitsPage extends React.Component {

  constructor(props) {
    super(props);
    this.setState({});
  }

  render() {
    return (
      <div>
        <NavBar logoutUrl={Urls['users:logout']()} />
        <div className="container">
          <Box>
            TO DO
          </Box>
        </div>
      </div>
    );
  }
}


CommitsPage.propTypes = {
  // dispatch: PropTypes.func.isRequired,
};


CommitsPage.defaultProps = {
};


const mapStateToProps = state => state;


export default connectRouter(mapStateToProps, CommitsPage);
