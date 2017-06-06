'use strict'
import { NavigatorTabOne } from '../tabOne/navigationConfiguration';
const initialState = {
//   nasSiteList: [], //for dropdown list
//   nasFolderTree: { rootMap: [] },
//   nasFileList: [],
//   currentDir: '',
};

export const tabOneReducer = (state, action) => {
  switch (action.type) {
    case 'goSecond':
      return {
        ...state,
        index:0
      };
    default:
      return NavigatorTabOne.router.getStateForAction(action, state) || state;
  }
}
