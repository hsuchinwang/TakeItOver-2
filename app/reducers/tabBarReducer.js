'use strict'
import { TabBar } from '../tabBar/navigationConfiguration';
const initialState = {
//   nasSiteList: [], //for dropdown list
//   nasFolderTree: { rootMap: [] },
//   nasFileList: [],
//   currentDir: '',
};

export const tabBarReducer = (state, action) => {
  switch (action.type) {
    case 'JUMP_TO_TAB':
      return {
        ...state,
       index: 0,
       url: action.payload.e.data
      };
    default:
      return TabBar.router.getStateForAction(action, state);
  }
}
