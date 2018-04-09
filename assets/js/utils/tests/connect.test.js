import React from 'react';
import { connectRouter } from 'utils';


const MockedComponent = () => <div />;


describe('connectRouter', () => {
  let Component;

  test('called', () => {
    Component = connectRouter({
      test: 'this is a test',
    }, MockedComponent);
    expect(Component.displayName).toEqual(
      'withRouter(Connect(MockedComponent))',
    );
  });
});
