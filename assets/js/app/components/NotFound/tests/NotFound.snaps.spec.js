import React from 'react';
import renderer from 'react-test-renderer';
import { NotFound } from 'app/components';
import * as ReactRouter from 'react-router-dom';

ReactRouter.Link = jest.fn(props => (
  <a href={props.to}>{props.children}</a>
));


describe('NotFound', () => {
  let Component;
  let tree;

  test('does not render without all props', () => {
    global.console = {
      error: jest.fn(),
    };
    renderer.create(<NotFound />);
    renderer.create(<NotFound title="title" />);
    renderer.create(<NotFound title="title" faClassName="fa" />);
    renderer.create(<NotFound title="title">Child</NotFound>);
    expect(global.console.error).toHaveBeenCalledTimes(3);
  });

  test('renders', () => {
    Component = renderer.create(
      <NotFound title="title" faClassName="fa fa-test">
        <div>Node</div>
      </NotFound>,
    );
    tree = Component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
