import React from 'react';
import renderer from 'react-test-renderer';
import CommitList from 'app/components/CommitViewer/CommitList';
import * as Components from 'app/components';
import * as CommitModule from 'app/components/CommitViewer/Commit';

Components.NotFound = jest.fn(props => (
  <div className={props.faClassName} title={props.title} />
));

Components.Spinner = jest.fn(() => (
  <div id="spinner" />
));

CommitModule.default = jest.fn(() => (
  <div id="commit" />
));


describe('CommitList', () => {
  let Component;
  let tree;

  test('renders with items', () => {
    Component = renderer.create(
      <CommitList
        items={[{
          message: 'test',
          date: '2018-04-02T22:53:19Z',
          branch: 'master',
          repository: 'test/test',
          url: 'https://github.com/',
          sha: '132465789',
          author: {
            login: 'author',
            github_id: 1,
            name: 'Author Name',
          },
        }, {
          message: 'test2',
          date: '2018-04-02T22:53:19Z',
          branch: 'master',
          repository: 'test/test',
          url: 'https://github.com/',
          sha: '321654987',
          author: {
            login: 'author',
            github_id: 1,
            name: 'Author Name',
          },
        }]}
      />,
    );
    tree = Component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('renders without items', () => {
    Component = renderer.create(<CommitList />);
    tree = Component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('renders while fetching', () => {
    Component = renderer.create(<CommitList isFetching />);
    tree = Component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
