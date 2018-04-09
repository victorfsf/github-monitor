import React from 'react';
import renderer from 'react-test-renderer';
import { Spinner } from 'app/components';


describe('Spinner', () => {
  let Component;
  let tree;

  test('renders', () => {
    Component = renderer.create(<Spinner />);
    tree = Component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
