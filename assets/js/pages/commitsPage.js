import React from 'react';
import PropTypes from 'prop-types';
import { connectRouter } from 'utils';
import { setBreadcrumbs } from 'redux/actions/breadcrumb';
import { breadcrumbPropTypes } from 'types';
import { CommitViewer } from 'app/components';


class CommitsPage extends React.Component {

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(setBreadcrumbs([{
      active: true,
      name: 'Commits',
      link: this.props.match.url,
    }]));
  }

  render() {
    const { breadcrumbs, history } = this.props;
    return (
      <CommitViewer
        breadcrumbs={breadcrumbs}
        history={history}
      />
    );
  }
}


CommitsPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,  // eslint-disable-line react/forbid-prop-types
  history: PropTypes.object.isRequired,  // eslint-disable-line react/forbid-prop-types
  breadcrumbs: PropTypes.arrayOf(breadcrumbPropTypes),
};


CommitsPage.defaultProps = {
  breadcrumbs: [],
};


const mapStateToProps = (state) => {
  const { breadcrumbList } = state;
  return {
    breadcrumbs: breadcrumbList,
  };
};


export default connectRouter(mapStateToProps, CommitsPage);
