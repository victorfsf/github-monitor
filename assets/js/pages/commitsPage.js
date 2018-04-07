import React from 'react';
// import PropTypes from 'prop-types';
import { Container, Box } from 'app/components';
import { connectRouter } from 'utils';


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

  render() {
    return (
      <Container breadcrumbs={this.state.breadcrumbs}>
        <Box>
          <div className="align-middle row">
            <div className="col-10">
              <div className="row">
                <div className="col-12">
                  Captured Commits
                  <button type="button" className="btn btn-sm btn-link">
                    <i className="fa fa-refresh" />
                  </button>
                </div>
                <div className="col-12">
                  <small className="text-muted">
                    Last Update: Apr 9, 2017 at 12:20 p.m.
                  </small>
                </div>
              </div>
            </div>
          </div>
        </Box>
      </Container>
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
