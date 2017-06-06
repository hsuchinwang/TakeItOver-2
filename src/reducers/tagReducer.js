import * as ActionTypes from '../constants/ActionTypes';
import { convertTagTree } from '../common/Utils';

const initialState = {
  tagList: {},
  selectItemData: null,
};

export function tag(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.TAG_SET_LIST:
      return {
        ...state,
        tagList: Object.assign(state.tagList, convertTagTree(action.payload.siteInfo, action.payload.tagList)),
      };
    case ActionTypes.TAG_SET_INIT_LIST:
      return {
        ...state,
        tagList: {},
      };
    case ActionTypes.TAG_SET_RENAME_ACTION:
      state.tagList[action.payload.para.connId].list[action.payload.para.id].actType = 'rename';
      return {
        ...state,
        siteTree: Object.assign({}, state.tagList),
      };
    case ActionTypes.TAG_SET_RENAME:
      state.tagList[action.payload.para.connId].list[action.payload.para.id].actType = null;
      if (action.payload.isRename) {
        state.tagList[action.payload.para.connId].list[action.payload.para.id].name = action.payload.para.name;
        state.tagList[action.payload.para.connId].order = action.payload.newOrder;
      }
      return {
        ...state,
        tagList: { ...state.tagList },
      };
    case ActionTypes.TAG_DELETE:
      delete state.tagList[action.payload.para.connId].list[action.payload.para.id];
      state.tagList[action.payload.para.connId].order = action.payload.newOrder;
      return {
        ...state,
        tagList: { ...state.tagList },
      };
    case ActionTypes.TAG_SET_SELECT_ITEM:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}
