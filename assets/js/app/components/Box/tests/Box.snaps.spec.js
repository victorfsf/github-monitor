import React from 'react';
import renderer from 'react-test-renderer';
import { Box } from 'app/components';


describe('Box', () => {
  let Component;
  let tree;

  test('does not render without children', () => {
    global.console = {
      error: jest.fn(),
    };
    renderer.create(<Box />);
    expect(global.console.error).toHaveBeenCalledTimes(1);
  });

  test('renders', () => {
    Component = renderer.create(<Box><div>Child</div></Box>);
    tree = Component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
