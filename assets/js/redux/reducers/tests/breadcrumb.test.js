import reducer from 'redux/reducers/breadcrumb';
import { SET_BREADCRUMBS } from 'redux/actions/breadcrumb';


describe('Breadcrumb reducers', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual([]);
  });

  it('should handle SET_BREADCRUMBS', () => {
    expect(
      reducer([], {
        type: SET_BREADCRUMBS,
        value: [{
          name: 'Home',
          link: '/',
          active: true,
        }],
      }),
    ).toEqual([{
      name: 'Home',
      link: '/',
      active: true,
    }]);

    expect(
      reducer([{
        name: 'Home',
        link: '/',
        active: true,
      }], {
        type: SET_BREADCRUMBS,
        value: [{
          name: 'Home',
          link: '/',
          active: false,
        }, {
          name: 'Commits',
          link: '/commits/',
          active: true,
        }],
      }),
    ).toEqual([{
      name: 'Home',
      link: '/',
      active: false,
    }, {
      name: 'Commits',
      link: '/commits/',
      active: true,
    }]);

    expect(
      reducer([{
        name: 'Home',
        link: '/',
        active: false,
      }, {
        name: 'Commits',
        link: '/commits/',
        active: true,
      }], {
        type: SET_BREADCRUMBS,
        value: [{
          name: 'Home',
          link: '/',
          active: true,
        }],
      }),
    ).toEqual([{
      name: 'Home',
      link: '/',
      active: true,
    }]);
  });
});
