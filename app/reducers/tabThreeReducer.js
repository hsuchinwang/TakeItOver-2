'use strict'
import { NavigatorTabThree } from '../tabThree/navigationConfiguration';
const initialState = {
//   nasSiteList: [], //for dropdown list
//   nasFolderTree: { rootMap: [] },
//   nasFileList: [],
//   currentDir: '',
};

export const tabThreeReducer = (state, action) => {
  switch (action.type) {
    case 'USER_FETCH_REQUESTED':
      return {
        ...state,
       //index: 0,
      };
    case 'USER_FETCH_SUCCEEDED':
      return {
        ...state,
       //index: 0,
    };
    default:
      return NavigatorTabThree.router.getStateForAction(action, state);
  }
}
