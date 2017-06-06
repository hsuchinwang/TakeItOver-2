import * as ActionTypes from '../../constants/ActionTypes';
import { callApi, requireOption } from '../../apis/apiActions';
import { getNoteInfo } from './noteActions';
import { setMessage } from '../sysActions';
import { isInNoteList } from '../../common/Utils';

import * as noteApi from '../../apis/note';

/** testable **/
// FIXME, **must** replace getTagNoteListFromDB
export function getNoteListByTag(tagId, connId, noteId) {
  const runnable = async function(siteInfo) {
    const notesInfo = await noteApi.getNoteListByTag(tagId, siteInfo);
    const noteList = notesInfo.notes;

    let noteInfo = {};
    if (noteList.length > 0) {
      if (noteId !== undefined && isInNoteList(noteList, noteId)) {
        noteInfo = await noteApi.getNoteInfo(noteId, siteInfo);
      }
      noteInfo = await noteApi.getNoteInfo(noteList[0].note_id, siteInfo);
    }

    return {
      notesInfo, noteInfo,
      other: { connId },
    };
  };
  return {
    type: ActionTypes.TASKCHAIN,
    payload: {
      actionType: ActionTypes.GET_NOTE_LIST_BY_TAG,
      options: { connId, needMask: true },
      runnable,
    },
  };
}

export function saveTagListByNoteId(para, tagList, tagId, refreshTagList) {
  
  const { connId, noteId } = para;
  const runnable = async function(siteInfo) {
    const result = {};

    result.tagList = await noteApi.saveTagListByNoteId(noteId, tagList, siteInfo);

    if (tagId) {
      const notesInfo = await noteApi.getNoteListByTag(tagId, siteInfo);
      const noteList = notesInfo.notes;

      const noteInfo = {};
      if (noteList.length > 0) {
        if (noteId !== undefined && isInNoteList(noteList, noteId)) {
          return noteApi.getNoteInfo(noteId, siteInfo);
        }
        return noteApi.getNoteInfo(noteList[0].note_id, siteInfo);
      }

      result.notesInfo = notesInfo;
      result.other = { connId };
      result.noteInfo = noteInfo;
    }

    return result;
  };
  return {
    type: ActionTypes.TASKCHAIN,
    payload: {
      actionType: ActionTypes.NOTE_SAVE_TAG_LIST,
      runnable,
      options: {
        connId,
        succMsg: 'TAG_SAVE_LIST',
        refresh: refreshTagList ? { path: 'tag', para: {} } : null,
      },
    },
  };
}
/** end testable **/

export function getRecentUseTagList() {
  return (dispatch) => {
    return callApi('note/recent_taglist').then((data) => {
      dispatch(setRecentTagList(data));
    }).catch(() => {
      dispatch(setMessage('message', 'NOTE_GET_RECENT_USE_TAG_LIST_ERRMSG', true));
    });
  };
}

function setTagNoteList(data, connId) {
  data.sec_info = {
    sec_name: data.tag_info.tag_name,
    type: 'tag',
  };
  return {
    type: ActionTypes.NOTEBOOK_SET_NOTE_LIST,
    payload: { data, connId },
  };
}

function setRecentTagList(data) {
  return {
    type: ActionTypes.NOTE_GET_RECENT_USE_TAG_LIST,
    payload: { tagList: data.tag_list },
  };
}
