import React from 'react';
import PropTypes from 'prop-types';
import { Box, Container } from 'app/components';
import { connectRouter } from 'utils';


class RepositoryPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      breadcrumbs: [{
        active: false,
        name: 'Commits',
        link: '/commits/',
      }, {
        active: true,
        name: this.getRepositoryName(),
        link: this.props.match.url,
      }],
    };
  }

  getRepositoryName() {
    const { params } = this.props.match;
    return `${params.owner}/${params.name}`;
  }

  render() {
    return (
      <Container breadcrumbs={this.state.breadcrumbs}>
        <Box>
          TO DO
        </Box>
      </Container>
    );
  }
}


RepositoryPage.propTypes = {
  match: PropTypes.object.isRequired,  // eslint-disable-line react/forbid-prop-types
  // dispatch: PropTypes.func.isRequired,
};


RepositoryPage.defaultProps = {
};


const mapStateToProps = state => state;


export default connectRouter(mapStateToProps, RepositoryPage);
