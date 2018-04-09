import React from 'react';
import renderer from 'react-test-renderer';
import PageButton from 'app/components/Pagination/PageButton';


describe('PageButton', () => {
  let Component;
  let tree;

  test('does not render without onClick', () => {
    global.console = {
      error: jest.fn(),
    };
    renderer.create(<PageButton disabled>Child</PageButton>);
    expect(global.console.error).toHaveBeenCalledTimes(1);
  });

  test('renders', () => {
    Component = renderer.create(
      <PageButton onClick={e => e}>
        Child
      </PageButton>,
    );
    tree = Component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('renders disabled', () => {
    Component = renderer.create(
      <PageButton disabled onClick={e => e}>
        Child
      </PageButton>,
    );
    tree = Component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
