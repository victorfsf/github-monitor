import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

const connectRouter = (props, component) => (
  withRouter(connect(props)(component))
);

export default connectRouter;
