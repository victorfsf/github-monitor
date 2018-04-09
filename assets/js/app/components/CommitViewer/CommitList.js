import React from 'react';
import PropTypes from 'prop-types';
import { commitPropTypes } from 'types';
import { NotFound, Spinner } from 'app/components';
import { Link } from 'react-router-dom';
import Commit from './Commit';
import './styles.scss';


const CommitList = (props) => {
  const { items, isFetching } = props;

  if (isFetching) {
    return <Spinner />;
  }

  if (!items || items.length === 0) {
    return (
      <NotFound title="Nothing to see here!" faClassName="fa fa-4x fa-frown-o">
        Come back after <Link to="/">adding some repositories</Link>.
      </NotFound>
    );
  }

  return (
    <div>
      {items.map(
        commit => (
          <Commit key={commit.id} data={commit} />
        ),
      )}
    </div>
  );
};


CommitList.propTypes = {
  items: PropTypes.arrayOf(commitPropTypes),
  isFetching: PropTypes.bool,
};


CommitList.defaultProps = {
  isFetching: false,
  items: [],
};


export default CommitList;
