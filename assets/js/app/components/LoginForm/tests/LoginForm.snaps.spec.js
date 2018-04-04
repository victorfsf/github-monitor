import React from 'react';
import renderer from 'react-test-renderer';
import LoginForm from 'app/components/LoginForm';


describe('LoginForm', () => {
  let Component;
  let tree;

  test('Form renders without url', () => {
    global.console = {
      error: jest.fn(),
    };
    Component = renderer.create(<LoginForm />);
    tree = Component.toJSON();
    expect(global.console.error).toHaveBeenCalledWith(
      'Warning: Failed prop type: The prop `loginUrl` is marked as required ' +
      'in `LoginForm`, but its value is `undefined`.\n    in LoginForm',
    );
  });

  test('Form renders with url', () => {
    Component = renderer.create(<LoginForm loginUrl="/login/url/" />);
    tree = Component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
