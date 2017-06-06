import * as ActionTypes from '../constants/ActionTypes';
import { getTreeListFromDB } from '../actions/note/notebookActions';
import { getNoteListFromDB, getSiteNoteListFromDB } from '../actions/note/noteActions';
import { getNoteListByTag } from '../actions/note/tagActions';
import { getTagListFromDB } from '../actions/tagActions';

export default store => next => action => {
  if ('type' in action) {
    switch (action.type) {
      case ActionTypes.SYS_SET_REFRESH_TREE:
        store.dispatch(getTreeListFromDB(action.payload));
        return;
      case ActionTypes.SYS_SET_REFRESH_NOTE:
        store.dispatch(getNoteListFromDB(action.payload.sectionId, action.payload.siteId, action.payload.noteId));
        return;
      case ActionTypes.SYS_SET_REFRESH_TAG:
        store.dispatch(getTagListFromDB());
        return;
      case ActionTypes.SYS_SET_REFRESH_TAGNOTE:
        store.dispatch(getNoteListByTag(action.payload.tagId, action.payload.siteId));
        return;
      case ActionTypes.SYS_SET_REFRESH_SEARCH:
        store.dispatch(getSiteNoteListFromDB('search', action.payload.keyword, action.payload.siteId, action.payload.noteId));
        return;
      case ActionTypes.SYS_SET_REFRESH_IMPORTANT:
        store.dispatch(getSiteNoteListFromDB('important', '', action.payload.siteId, action.payload.noteId));
        return;
      default:
        break;
    }
  }
  next(action);
};
