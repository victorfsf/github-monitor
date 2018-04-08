import React from 'react';
import renderer from 'react-test-renderer';
import NavBar from 'app/components/Container/NavBar';
import { MemoryRouter } from 'react-router-dom';


describe('NavBar', () => {
  let Component;
  let tree;

  test('Renders without url', () => {
    global.console = {
      error: jest.fn(),
    };
    Component = renderer.create(
      <MemoryRouter><NavBar /></MemoryRouter>,
    );
    tree = Component.toJSON();
    expect(global.console.error).toHaveBeenCalledWith(
      'Warning: Failed prop type: The prop `logoutUrl` is marked as ' +
      'required in `NavBar`, but its value is `undefined`.\n    in NavBar',
    );
  });

  test('Renders with url', () => {
    Component = renderer.create(
      <MemoryRouter><NavBar logoutUrl="/logout/url/" /></MemoryRouter>,
    );
    tree = Component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
