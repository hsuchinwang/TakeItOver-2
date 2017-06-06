import * as ActionTypes from '../constants/ActionTypes';

const initialState = {
  nasSiteList: [], //for dropdown list
  nasFolderTree: { rootMap: [] },
  nasFileList: [],
  currentDir: '',
};

export function nas(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.NAS_SET_DIR:
      return {
        ...state,
        currentDir: action.payload.currentDir,
      };
    case ActionTypes.NAS_SET_FOLDER_TREE:
      return {
        ...state,
        nasFolderTree: action.payload.nasFolderTree,
      };
    case ActionTypes.NAS_SET_FILE_LIST:
      return {
        ...state,
        nasFileList: action.payload.nasFileList,
      };
    case ActionTypes.NAS_SET_SITE_LIST:
      return {
        ...state,
        nasSiteList: action.payload.nasSiteList,
      };
    case ActionTypes.NAS_INIT_FOLDER_FILE:
      return {
        ...state,
        nasFolderTree: {
          rootMap: [],
        },
        nasFileList: [],
        currentDir: '',
      };
    default:
      return state;
  }
}
