import React from 'react';
import renderer from 'react-test-renderer';
import Avatar from 'app/components/CommitViewer/Avatar';


describe('Avatar', () => {
  let Component;
  let tree;

  test('does not render without name', () => {
    global.console = {
      error: jest.fn(),
    };
    renderer.create(<Avatar />);
    expect(global.console.error).toHaveBeenCalledTimes(1);
  });

  test('renders without id', () => {
    Component = renderer.create(
      <Avatar name="Author" />,
    );
    tree = Component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('renders with id', () => {
    Component = renderer.create(
      <Avatar name="Author" id={1} />,
    );
    tree = Component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
