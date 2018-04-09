import React from 'react';
import renderer from 'react-test-renderer';
import { Pagination } from 'app/components';


describe('Pagination', () => {
  let Component;
  let tree;

  test('does not render without functions', () => {
    global.console = {
      error: jest.fn(),
    };
    renderer.create(<Pagination />);
    renderer.create(<Pagination onClickNext={e => e} />);
    renderer.create(<Pagination onClickPrev={e => e} />);
    expect(global.console.error).toHaveBeenCalledTimes(2);
  });

  test('renders', () => {
    Component = renderer.create(
      <Pagination onClickNext={e => e} onClickPrev={e => e} next />,
    );
    tree = Component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
