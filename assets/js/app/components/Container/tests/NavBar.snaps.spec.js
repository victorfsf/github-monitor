import React from 'react';
import renderer from 'react-test-renderer';
import NavBar from 'app/components/Container/NavBar';
import * as ReactRouter from 'react-router-dom';

ReactRouter.Link = jest.fn(props => (
  <a href={props.to}>{props.children}</a>
));


describe('NavBar', () => {
  let Component;
  let tree;

  test('Renders without url', () => {
    global.console = {
      error: jest.fn(),
    };
    Component = renderer.create(<NavBar />);
    tree = Component.toJSON();
    expect(global.console.error).toHaveBeenCalledWith(
      'Warning: Failed prop type: The prop `logoutUrl` is marked as ' +
      'required in `NavBar`, but its value is `undefined`.\n    in NavBar',
    );
  });

  test('Renders with url', () => {
    Component = renderer.create(<NavBar logoutUrl="/logout/url/" />);
    tree = Component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
