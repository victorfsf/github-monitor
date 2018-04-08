import * as actions from 'redux/actions/breadcrumb';


describe('Breadcrumb actions', () => {
  it('should create an action to set the breadcrumb object', () => {
    const value = [{
      link: null,
      active: true,
      name: 'Home',
    }];
    const expectedAction = {
      type: actions.SET_BREADCRUMBS,
      value,
    };
    expect(actions.setBreadcrumbs(value)).toEqual(expectedAction);
  });
});
