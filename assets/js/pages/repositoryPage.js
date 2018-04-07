import React from 'react';
import PropTypes from 'prop-types';
import { connectRouter } from 'utils';
import { setBreadcrumbs } from 'redux/actions/breadcrumb';
import { breadcrumbPropTypes } from 'types';
import { CommitViewer } from 'app/components';


class RepositoryPage extends React.Component {

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(setBreadcrumbs([{
      active: false,
      name: 'Commits',
      link: '/commits/',
    }, {
      active: true,
      name: this.getRepositoryName(),
      link: this.props.match.url,
    }]));
  }

  getRepositoryName() {
    const { params } = this.props.match;
    return `${params.owner}/${params.name}`;
  }

  render() {
    const { breadcrumbs, history } = this.props;
    const repo = this.getRepositoryName();
    return (
      <CommitViewer
        breadcrumbs={breadcrumbs}
        history={history}
        repo={repo}
      />
    );
  }
}


RepositoryPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,  // eslint-disable-line react/forbid-prop-types
  history: PropTypes.object.isRequired,  // eslint-disable-line react/forbid-prop-types
  breadcrumbs: PropTypes.arrayOf(breadcrumbPropTypes),
};


RepositoryPage.defaultProps = {
  breadcrumbs: [],
};


const mapStateToProps = (state) => {
  const { breadcrumbList } = state;
  return {
    breadcrumbs: breadcrumbList,
  };
};


export default connectRouter(mapStateToProps, RepositoryPage);
