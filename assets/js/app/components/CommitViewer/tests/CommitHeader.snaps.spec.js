import React from 'react';
import renderer from 'react-test-renderer';
import CommitHeader from 'app/components/CommitViewer/CommitHeader';


describe('CommitHeader', () => {
  let Component;
  let tree;

  test('renders', () => {
    Component = renderer.create(
      <CommitHeader repo="test/test" onClick={e => e} />,
    );
    tree = Component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('renders with lastUpdate and count', () => {
    Component = renderer.create(
      <CommitHeader
        count={10}
        repo="test/test"
        onClick={e => e}
        lastUpdate="2018-04-02T22:53:19Z"
      />,
    );
    tree = Component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('does not render without onClick', () => {
    global.console = {
      error: jest.fn(),
    };
    renderer.create(<CommitHeader />);
    expect(global.console.error).toHaveBeenCalledTimes(1);
  });
});
