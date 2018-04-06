import React from 'react';
import { NavBar, Box } from 'app/components';
import Urls from 'utils/urls';
import RepoForm from 'app/containers';
import { connectRouter } from 'utils';


class HomePage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  handleSubmit(event) {
    this.setState({});
    event.preventDefault();
  }

  render() {
    return (
      <div>
        <NavBar logoutUrl={Urls['users:logout']()} />
        <div className="container">
          <Box>
            <RepoForm onSubmit={e => this.handleSubmit(e)} />
          </Box>
        </div>
      </div>
    );
  }
}

HomePage.propTypes = {

};

export default connectRouter(null, HomePage);
