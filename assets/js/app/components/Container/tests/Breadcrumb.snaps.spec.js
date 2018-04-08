import React from 'react';
import renderer from 'react-test-renderer';
import Breadcrumb from 'app/components/Container/Breadcrumb';
import * as ReactRouter from 'react-router-dom';

ReactRouter.Link = jest.fn(props => (
  <a href={props.to}>{props.children}</a>
));

describe('Breadcrumb', () => {
  let Component;
  let tree;

  test('Renders without items', () => {
    Component = renderer.create(<Breadcrumb />);
    tree = Component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('Renders with items', () => {
    const items = [{
      active: false,
      name: 'Commits',
      link: '/commits/',
    }, {
      active: true,
      name: 'Repository',
      link: '/repo/',
    }];
    Component = renderer.create(<Breadcrumb items={items} />);
    tree = Component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
