import React from 'react';
import renderer from 'react-test-renderer';
import { RepoField } from 'app/components';


describe('RepoField', () => {
  let Component;
  let tree;

  test('does not render', () => {
    global.console = {
      error: jest.fn(),
    };
    renderer.create(<RepoField />);
    renderer.create(<RepoField isFetching value="test" />);
    renderer.create(<RepoField hasError errorMessage="error" />);
    renderer.create(<RepoField value="test" />);
    expect(global.console.error).toHaveBeenCalledTimes(1);
  });

  test('renders', () => {
    Component = renderer.create(
      <RepoField onChange={e => e} />,
    );
    tree = Component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('renders with value', () => {
    Component = renderer.create(
      <RepoField value="test/test" onChange={e => e} />,
    );
    tree = Component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('renders with error', () => {
    Component = renderer.create(
      <RepoField
        value="test/test"
        onChange={e => e}
        errorMessage="Repository not found."
        hasError
      />,
    );
    tree = Component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('renders while fetching', () => {
    Component = renderer.create(
      <RepoField
        value="test/test"
        onChange={e => e}
        isFetching
      />,
    );
    tree = Component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
