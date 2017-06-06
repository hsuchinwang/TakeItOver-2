'use strict'
import { NavigatorTabFour } from '../tabFour/navigationConfiguration';
const initialState = {
//   nasSiteList: [], //for dropdown list
//   nasFolderTree: { rootMap: [] },
//   nasFileList: [],
//   currentDir: '',
};

export const tabFourReducer = (state, action) => {
  switch (action.type) {
    case 'goSecond':
      return {
        ...state,
       index: 0,
      };
    default:
      return NavigatorTabFour.router.getStateForAction(action,state);
  }
}
