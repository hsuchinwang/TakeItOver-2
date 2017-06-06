import * as ActionTypes from '../constants/ActionTypes';
import { convertPublicTreeList } from '../common/Utils';

const initialState = {
  publishedLinkList: [],
  publicBookList: [],
  publicSecList: {},
  publicNoteList: {},
  publicLinkNotFound: null,
  isPublicLinkEncrypt: null,
  isGetInfo: false,
  noteInfo: {
    nb_id: null,
    nb_name: '',
    sec_id: null,
    sec_name: '',
    note_id: null,
    note_name: '',
    content: null,
    update_time: '',
    login_id: null,
  },
};

export function publicLink(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.SET_PUBLIC_TREE_LIST:
      convertPublicTreeList(action.payload.data, state);
      return {
        ...state,
        isPublicLinkEncrypt: action.payload.isEncrypt,
        publicLinkNotFound: action.payload.notFound,
      };
    case ActionTypes.PUBLIC_LINK_NOT_FOUND:
      return {
        ...state,
        publicLinkNotFound: action.payload.notFound,
      };
    case ActionTypes.DECRYPT_PUBLIC_NOTE:
      return {
        ...state,
        isPublicLinkEncrypt: action.payload.isEncrypt,
      };
    case ActionTypes.SET_PUBLIC_NOTE_INFO:
      return {
        ...state,
        noteInfo: action.payload.noteInfo,
      };
    case ActionTypes.SET_GETTING_NOTEINFO_FLAG:
      return {
        ...state,
        isGetInfo: action.payload.isGetting,
      };
    default:
      return state;
  }
}
