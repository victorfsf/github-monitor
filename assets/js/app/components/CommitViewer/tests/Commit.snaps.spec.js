import React from 'react';
import renderer from 'react-test-renderer';
import Commit from 'app/components/CommitViewer/Commit';
import * as AvatarModule from 'app/components/CommitViewer/Avatar';
import * as ReactRouter from 'react-router-dom';
import * as utils from 'utils';

utils.formatDate = jest.fn(() => 'MMM D, YYYY [at] h:mm:ss A');

ReactRouter.Link = jest.fn(props => (
  <a href={props.to}>{props.children}</a>
));

AvatarModule.default = jest.fn(props => (
  <div id={props.id} name={props.name} />
));


describe('Commit', () => {
  let Component;
  let tree;

  test('renders with payload', () => {
    Component = renderer.create(
      <Commit
        data={{
          message: 'test',
          date: 'today',
          branch: 'master',
          repository: 'test/test',
          url: 'https://github.com/',
          sha: '132465789',
          author: {
            login: 'author',
            github_id: 1,
            name: 'Author Name',
          },
        }}
      />,
    );
    tree = Component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('does not render without payload', () => {
    global.console = {
      error: jest.fn(),
    };
    renderer.create(<Commit />);
    expect(global.console.error).toHaveBeenCalledTimes(2);
  });
});
