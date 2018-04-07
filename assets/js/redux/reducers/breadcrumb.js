import {
  SET_BREADCRUMBS,
} from 'redux/actions/breadcrumb';


const breadcrumbList = (state = [], action) => {
  switch (action.type) {
    case SET_BREADCRUMBS:
      return action.value;
    default:
      return state;
  }
};


export default breadcrumbList;
