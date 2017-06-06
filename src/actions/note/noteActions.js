import * as ActionTypes from '../../constants/ActionTypes';
import { callApi, callApiWithAction, requireOption } from '../../apis/apiActions';
import { setMessage, setRefresh, toggleLoadingMask } from '../sysActions';
import { transformNoteInfo, isInNoteList } from '../../common/Utils';
import { setDeleteSiteNote } from './index';

import * as noteApi from '../../apis/note';
import * as userApi from '../../apis/user';

/** testable **/
export function setNoteInfo(data) {
  return {
    type: ActionTypes.NOTE_SET_INFO,
    payload: data,
  };
}

export function getNoteInfo(noteId, connId, needRemountEditor = false) {
  const runnable = async function(siteInfo) {
    const result = {};
    result.noteInfo = await noteApi.getNoteInfo(noteId, siteInfo);
    result.noteInfo.needRemountEditor = needRemountEditor;
    if (connId !== 'local') result.userInfo = await userApi.getUserInfo(siteInfo);
    return result;
  };
  return {
    type: ActionTypes.TASKCHAIN,
    payload: {
      actionType: ActionTypes.NOTE_GET_INFO,
      runnable,
      options: { connId, needMask: false },
    },
  };
}

// FIXME, **must** replace getNoteListFromDB
export function getNoteListBySection(secId, connId, noteId, rename = false) {
  const runnable = async function(siteInfo) {
    const notesInfo = await noteApi.getNoteListBySection(secId, siteInfo);
    const noteList = notesInfo.notes;

    let noteInfo = {};
    if (noteList.length > 0) {
      if (noteId !== undefined && isInNoteList(noteList, noteId)) {
        noteInfo = await noteApi.getNoteInfo(noteId, siteInfo);
      } else {
        noteInfo = await noteApi.getNoteInfo(noteList[0].note_id, siteInfo);
      }
    }

    return {
      notesInfo, noteInfo,
      other: { rename, connId },
    };
  };
  return {
    type: ActionTypes.TASKCHAIN,
    payload: {
      actionType: ActionTypes.GET_NOTE_LIST_BY_SECTION,
      runnable,
      options: { connId, needMask: true },
    },
  };
}

// FIXME, **must** replace getTrashNoteListFromDB
export function getNoteListInTrashcan(connId, noteId) {
  const runnable = async function(siteInfo) {
    const notesInfo = await noteApi.getNoteListInTrashcan(siteInfo);
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
    }
  };
  return {
    type: ActionTypes.TASKCHAIN,
    payload: {
      actionType: ActionTypes.GET_NOTE_LIST_IN_TRASHCAN,
      options: { connId,  needMask: true },
      runnable,
    },
  };
}
export function getTagListByNoteFromDB(noteId, connId) {
  return {
    type: ActionTypes.TASKCHAIN,
    payload: {
      actionType: ActionTypes.NOTE_SET_TAG_LIST,
      runnable: async function(siteInfo) {
        const tagList = await noteApi.getTagListByNote(noteId, siteInfo);
        return { tagList };
      },
      options: { connId },
    },
  };
}

export function unLockSnapshot(snapshotId, connId, passwd, errFunc) {
  return {
    type: ActionTypes.TASKCHAIN,
    payload: {
      actionType: ActionTypes.NOTE_GET_SNAPSHOT,
      runnable: async function(siteInfo) {
        try {
          const data = await noteApi.decryptSnapshot(snapshotId, passwd, siteInfo);
          return { data };
        } catch(err) {
          errFunc(err);
        }
      },
      options: { connId },
    },
  };
}

export function getSnapshot(snapshotId, connId) {
  return {
    type: ActionTypes.TASKCHAIN,
    payload: {
      actionType: ActionTypes.NOTE_GET_SNAPSHOT,
      runnable: async function(siteInfo) {
        const data = await noteApi.getSnapshotNote(snapshotId, siteInfo);
        return { data };
      },
      options: { connId },
    },
  };
}
/** end testable **/

function setNoteList(data, connId, rename = false) {
  return {
    type: ActionTypes.NOTEBOOK_SET_NOTE_LIST,
    payload: {
      data,
      connId,
      rename,
    },
  };
}

export function getNoteListFromDB(secId, connId, selectNote = null, rename = false) {
  return (dispatch, getState) => {
    const { user: { siteList } } = getState();
    const siteInfo = (connId in siteList) ? siteList[connId] : null;
    const require = requireOption(siteInfo, 'note', null, { sec_id: secId });

    return callApi(require).then((data) => {
      dispatch(setNoteList(data, connId, rename));
      if (selectNote) dispatch(getNoteInfo(selectNote, connId));
    }).catch(() => {
      dispatch(setMessage('message', 'NOTEBOOK_SET_NOTE_LIST_ERRMSG', true));
    });
  };
}

export function initNoteList() {
  return {
    type: ActionTypes.NOTEBOOK_INIT_NOTE_LIST,
  };
}

function setTrashNoteList(data, connId) {
  data.sec_info = {
    sec_name: window.lang_dictionary.general_trashcan,
    type: 'trashcan',
  };
  return {
    type: ActionTypes.NOTEBOOK_SET_NOTE_LIST,
    payload: {
      data,
      connId,
    },
  };
}

export function getTrashNoteListFromDB(connId, selectNote = null) {
  return (dispatch, getState) => {
    const { user: { siteList } } = getState();
    const siteInfo = (connId in siteList) ? siteList[connId] : null;
    const require = requireOption(siteInfo, 'recycle_bin', null);

    return callApi(require).then((data) => {
      dispatch(setTrashNoteList(data, connId));
      if (selectNote) dispatch(getNoteInfo(selectNote, connId));
    }).catch(() => {
      dispatch(setMessage('message', 'NOTEBOOK_SET_TRASH_LIST_ERRMSG', true));
    });
  };
}

function setSiteNoteList(siteInfo, data) {
  return {
    type: ActionTypes.NOTEBOOK_SET_SITE_NOTE_LIST,
    payload: {
      siteInfo,
      noteList: data.note_list,
    },
  };
}

export function getSiteNoteListFromDB(type = 'search', keyword = '', connId = null, selectNote = null) {
  return (dispatch, getState) => {
    const { user: { siteList } } = getState();
    const path = (type === 'search') ? 'search/keyword' : 'important/note';

    for (const key in siteList) {
      if (!siteList.hasOwnProperty(key)) continue;
      const require = (type === 'search') ? requireOption(siteList[key], path, 'post', { keyword }) : requireOption(siteList[key], path);
      dispatch(callApiWithAction(require, setSiteNoteList.bind(this, siteList[key]), setMessage.bind(this, 'message', 'NOTEBOOK_SET_NOTE_LIST_ERRMSG', true, 5000)));
      if (selectNote) dispatch(getNoteInfo(selectNote, connId));
    }
  };
}

export function addImportantNoteInfo(data) {
  return {
    type: ActionTypes.NOTE_SET_IMPORTANT,
    payload: data,
  };
}

export function removeImportantNoteInfo(data) {
  return {
    type: ActionTypes.NOTE_CANCEL_IMPORTANT,
    payload: data,
  };
}

export function setMoveToSection(para, newNotebook, newSection, succFunc) {
  return (dispatch, getState) => {
    const { connId, noteId } = para;
    const { user: { siteList } } = getState();
    const siteInfo = (connId in siteList) ? siteList[connId] : null;
    const require = requireOption(siteInfo, `note/${noteId}/move`, 'put', { nb_id: newNotebook, sec_id: newSection });

    return callApi(require).then(() => {
      dispatch(initNoteList());
      dispatch(getNoteInfo(noteId, connId));
      dispatch(setRefresh());
      dispatch(setMessage('message', ActionTypes.NOTE_SET_MOVE));
      succFunc();
    }).catch(() => {
      dispatch(setMessage('message', 'NOTE_SET_MOVE_ERRMSG', true));
    });
  };
}

export function setDuplicate(connId, nbId, secId, noteId) {
  return (dispatch, getState) => {
    const { user: { siteList } } = getState();
    const siteInfo = (connId in siteList) ? siteList[connId] : null;
    const require = requireOption(siteInfo, 'note/copy', 'post', { nb_id: nbId, sec_id: secId, note_id: noteId });

    return callApi(require).then(data => {
      dispatch(getNoteListFromDB(secId, connId, data.note_id));
      dispatch(setRefresh());
      dispatch(setMessage('message', 'NOTE_SET_DUPLICATE'));
    }).catch(() => {
      dispatch(setMessage('message', 'NOTE_SET_DUPLICATE_ERRMSG', true));
    });
  };
}

export function toggleFullscreenMode() {
  return (dispatch, getState) => {
    const {
      note: {
        noteList: { order },
        siteNoteList,
        noteInfo,
        isFullscreenMode,
      },
    } = getState();

    const data = {
      isFullscreenMode: !isFullscreenMode,
    };
    /** convert site note list **/
    let count = 0;
    let siteNoteIndex = -1;
    for (const site in siteNoteList) {
      if (!siteNoteList.hasOwnProperty(site)) continue;
      for (const note in siteNoteList[site].list) {
        if (!siteNoteList[site].list.hasOwnProperty(note)) continue;
        if (siteNoteList[site].list[note].note_id === noteInfo.id && site === noteInfo.connId) {
          siteNoteIndex = count;
        }
        count++;
      }
    }
    const index = count > 0 && siteNoteIndex > -1 ? siteNoteIndex : order.indexOf(noteInfo.id);
    const length = count > 0 && siteNoteIndex > -1 ? count : order.length;

    if (!isFullscreenMode) {
      data.fullscreenModeButtons = {
        prev: !(index - 1 === -1 || index === -1),
        next: !(index + 1 === length),
      };
    }

    dispatch({
      type: ActionTypes.NOTEBOOK_TOGGLE_FULLSCREEN,
      payload: data,
    });
  };
}

export function showNextConent() {
  return (dispatch, getState) => {
    const {
      note: {
        noteList: { order, list },
        siteNoteList,
        noteInfo,
      },
    } = getState();

    /** convert site note list **/
    const siteNotes = [];
    let count = 0;
    let siteNoteIndex = -1;
    for (const site in siteNoteList) {
      if (!siteNoteList.hasOwnProperty(site)) continue;
      for (const note in siteNoteList[site].list) {
        if (!siteNoteList[site].list.hasOwnProperty(note)) continue;
        siteNotes.push(siteNoteList[site].list[note]);
        if (siteNoteList[site].list[note].note_id === noteInfo.id && site === noteInfo.connId) {
          siteNoteIndex = count;
        }
        count++;
      }
    }

    const index = count > 0 && siteNoteIndex > -1 ? siteNoteIndex : order.indexOf(noteInfo.id);
    const length = count > 0 && siteNoteIndex > -1 ? count : order.length;
    let data = {};

    if (index < length - 1) {
      const connId = count > 0 && siteNoteIndex > -1 ? siteNotes[index + 1].connId : list[order[index + 1]].connId;
      const noteId = count > 0 && siteNoteIndex > -1 ? siteNotes[index + 1].note_id : list[order[index + 1]].note_id;
      dispatch(getNoteInfo(noteId, connId));
      data = {
        fullscreenModeButtons: {
          prev: true,
          next: index + 1 !== length - 1,
        },
      };
    }

    dispatch({
      type: ActionTypes.NOTEBOOK_SHOW_NEXTCONTENT,
      payload: data,
    });
  };
}

export function showPrevConent() {
  return (dispatch, getState) => {
    const {
      note: {
        noteList: { order, list },
        siteNoteList,
        noteInfo,
      },
    } = getState();

    /** convert site note list **/
    const siteNotes = [];
    let count = 0;
    let siteNoteIndex = -1;
    for (const site in siteNoteList) {
      if (!siteNoteList.hasOwnProperty(site)) continue;
      for (const note in siteNoteList[site].list) {
        if (!siteNoteList[site].list.hasOwnProperty(note)) continue;
        siteNotes.push(siteNoteList[site].list[note]);
        if (siteNoteList[site].list[note].note_id === noteInfo.id && site === noteInfo.connId) {
          siteNoteIndex = count;
        }
        count++;
      }
    }

    const index = count > 0 && siteNoteIndex > -1 ? siteNoteIndex : order.indexOf(noteInfo.id);
    let data = {};

    if (index > 0) {
      const connId = count > 0 && siteNoteIndex > -1 ? siteNotes[index - 1].connId : list[order[index - 1]].connId;
      const noteId = count > 0 && siteNoteIndex > -1 ? siteNotes[index - 1].note_id : list[order[index - 1]].note_id;
      dispatch(getNoteInfo(noteId, connId));
      data = {
        fullscreenModeButtons: {
          prev: index - 1 !== 0,
          next: true,
        },
      };
    }

    dispatch({
      type: ActionTypes.NOTEBOOK_SHOW_PREVCONTENT,
      payload: data,
    });
  };
}

export function initSiteNoteList() {
  return {
    type: ActionTypes.NOTEBOOK_INIT_SITE_NOTE_LIST,
    payload: null,
  };
}

export function setImportant(noteId, connId, type, path) {
  return (dispatch, getState) => {
    const { user: { siteList } } = getState();
    const siteInfo = (connId in siteList) ? siteList[connId] : null;
    const require = requireOption(siteInfo, `important/${noteId}`, 'put', { type });
    return callApi(require).then(data => {
      if (type === 1) {
        dispatch(addImportantNoteInfo(transformNoteInfo(data.note_info, connId)));
        dispatch(setMessage('message', ActionTypes.NOTE_SET_IMPORTANT));
      } else {
        if (path === 'important') dispatch(setDeleteSiteNote(connId, noteId));
        dispatch(removeImportantNoteInfo(transformNoteInfo(data.note_info, connId)));
        dispatch(setMessage('message', ActionTypes.NOTE_CANCEL_IMPORTANT));
      }
    }).catch(() => {
      dispatch(setMessage('message', 'NOTE_SET_IMPORTANT_ERRMSG', true));
    });
  };
}

export function unLockEncryptNote(noteId, connId, passwd, errFunc) {
  return (dispatch, getState) => {
    const { user: { siteList } } = getState();
    const siteInfo = (connId in siteList) ? siteList[connId] : null;
    const require = requireOption(siteInfo, `note/${noteId}/check_encrypt`, 'post', { encrypt_code: passwd });

    return callApi(require).then(data => {
      dispatch(setNoteInfo(transformNoteInfo(data.note_info, connId)));
    }, errFunc.bind(this));
  };
}

export function initSnapshotInfo() {
  return {
    type: ActionTypes.NOTE_INIT_SNAPSHOT_INFO,
    payload: {
      snapshotInfo: {
        id: '',
        name: '',
        creator: '',
        encrypt: null,
        createTime: null,
        content: null,
      },
    },
  };
}

export function restoreSnapshot(snapshotId, noteId, connId) {
  return (dispatch, getState) => {
    const { user: { siteList } } = getState();
    const siteInfo = (connId in siteList) ? siteList[connId] : null;
    const require = requireOption(siteInfo, `restore/snapshot/${snapshotId}`, 'put');

    dispatch(toggleLoadingMask('snapshotRestore'));
    return callApi(require).then(() => {
      dispatch(toggleLoadingMask('snapshotRestore'));
      dispatch(getNoteInfo(noteId, connId, true));
      dispatch(setMessage('message', 'NOTE_SNAPSHOT_RESTORE'));
    }).catch(() => {
      dispatch(toggleLoadingMask('snapshotRestore'));
      dispatch(setMessage('message', 'NOTE_SNAPSHOT_RESTORE_ERRMSG', true));
    });
  };
}

export function saveAsSnapshot(snapshotId, connId) {
  return (dispatch, getState) => {
    const { user: { siteList } } = getState();
    const siteInfo = (connId in siteList) ? siteList[connId] : null;
    const require = requireOption(siteInfo, `saveas/snapshot/${snapshotId}`, 'post', { note_name: '' });

    dispatch(toggleLoadingMask('snapshotSaveAs'));
    return callApi(require).then(data => {
      dispatch(toggleLoadingMask('snapshotSaveAs'));
      dispatch(getNoteListFromDB(data.sec_id, connId, data.note_id, true));
      dispatch(setRefresh());
      dispatch(setMessage('message', 'NOTE_SNAPSHOT_SAVE_AS'));
    }).catch(() => {
      dispatch(toggleLoadingMask('snapshotSaveAs'));
      dispatch(setMessage('message', 'NOTE_SNAPSHOT_SAVE_AS_ERRMSG', true));
    });
  };
}

export function setSnapshotList(data = []) {
  return {
    type: ActionTypes.NOTE_SET_SNAPSHOT_LIST,
    payload: { snapshotList: data },
  };
}

export function getSnapshotList(noteId, connId) {
  return (dispatch, getState) => {
    const { user: { siteList } } = getState();
    const siteInfo = (connId in siteList) ? siteList[connId] : null;
    const require = requireOption(siteInfo, 'snapshot', 'get', { note_id: noteId });

    return callApi(require).then(data => {
      dispatch(setSnapshotList(data.snapshot_list));
    }).catch(() => {
      dispatch(setMessage('message', 'NOTE_GET_SNAPSHOT_LIST_ERRMSG', true));
    });
  };
}

export function setSnapshot(noteId, connId, name) {
  return (dispatch, getState) => {
    const { user: { siteList } } = getState();
    const siteInfo = (connId in siteList) ? siteList[connId] : null;
    const require = requireOption(siteInfo, 'snapshot', 'post', { note_id: noteId, name });

    return callApi(require).then(() => {
      dispatch(setMessage('message', 'NOTE_SET_SNAPSHOT'));
    }).catch(() => {
      dispatch(setMessage('message', 'NOTE_SET_SNAPSHOT_ERRMSG', true));
    });
  };
}

export function setSnapshotRename(snapshotId, connId, name, succFunc, errFunc) {
  return (dispatch, getState) => {
    const { user: { siteList } } = getState();
    const siteInfo = (connId in siteList) ? siteList[connId] : null;
    const require = requireOption(siteInfo, `snapshot/${snapshotId}`, 'put', { name });

    return callApi(require).then(() => {
      succFunc();
      dispatch(setMessage('message', 'NOTE_SET_SNAPSHOT_RENAME'));
    }).catch(() => {
      errFunc();
      dispatch(setMessage('message', 'NOTE_SET_SNAPSHOT_RENAME_ERRMSG', true));
    });
  };
}

export function setSnapshotDelete(snapshotId, connId, noteId) {
  return (dispatch, getState) => {
    const { user: { siteList } } = getState();
    const siteInfo = (connId in siteList) ? siteList[connId] : null;
    const require = requireOption(siteInfo, `snapshot/${snapshotId}`, 'delete', { note_id: noteId });
    return callApi(require).then(data => {
      dispatch(setSnapshotList(data.snapshot_list));
      dispatch(setMessage('message', 'NOTE_SET_SNAPSHOT_DELETE'));
    }).catch(() => {
      dispatch(setMessage('message', 'NOTE_SET_SNAPSHOT_DELETE_ERRMSG', true));
    });
  };
}

export function deleteNoteFromTrashcan(noteId, connId) {
  return (dispatch, getState) => {
    const { user: { siteList } } = getState();
    const siteInfo = (connId in siteList) ? siteList[connId] : null;
    const require = requireOption(siteInfo, `recycle_bin/${noteId}`, 'delete');

    return callApi(require).then(() => {
      dispatch(getTrashNoteListFromDB(connId)).then(() => {
        dispatch({
          type: ActionTypes.NOTEBOOK_DELETE_TRASH_NOTE,
          payload: { noteId },
        });
        dispatch(setMessage('message', ActionTypes.NOTEBOOK_DELETE_TRASH_NOTE));
      });
    }).catch(() => {
      dispatch(setMessage('message', 'NOTEBOOK_DELETE_TRASH_NOTE_ERRMSG', true));
    });
  };
}

export function emptyTrashcan(connId) {
  return (dispatch, getState) => {
    const { user: { siteList } } = getState();
    const siteInfo = (connId in siteList) ? siteList[connId] : null;
    const require = requireOption(siteInfo, 'recycle_bin', 'delete');

    return callApi(require).then(() => {
      dispatch({ type: ActionTypes.NOTEBOOK_INIT_TRASH_NOTE_LIST });
      dispatch(setMessage('message', ActionTypes.NOTEBOOK_INIT_TRASH_NOTE_LIST));
    }).catch(() => {
      dispatch(setMessage('message', `${ActionTypes.NOTEBOOK_INIT_TRASH_NOTE_LIST}_ERRMSG`, true));
    });
  };
}

export function restoreNoteFromTrashcan(noteId, connId, succFunc) {
  return (dispatch, getState) => {
    const { user: { siteList } } = getState();
    const siteInfo = (connId in siteList) ? siteList[connId] : null;
    const require = requireOption(siteInfo, `recycle_bin/${noteId}`, 'put');

    return callApi(require).then(() => {
      dispatch({ type: ActionTypes.NOTEBOOK_INIT_TRASH_RESTORE_NOTE_LIST });
      dispatch(setRefresh());
      dispatch(setMessage('message', ActionTypes.NOTEBOOK_INIT_TRASH_RESTORE_NOTE_LIST));
      dispatch(getNoteInfo(noteId, connId));
      succFunc();
    }).catch(() => {
      dispatch(setMessage('message', `${ActionTypes.NOTEBOOK_INIT_TRASH_RESTORE_NOTE_LIST}_ERRMSG`, true));
    });
  };
}

export function restoreTrashcan(connId) {
  return (dispatch, getState) => {
    const { user: { siteList } } = getState();
    const siteInfo = (connId in siteList) ? siteList[connId] : null;
    const require = requireOption(siteInfo, 'recycle_bin', 'post');

    return callApi(require).then(() => {
      dispatch({ type: ActionTypes.NOTEBOOK_INIT_TRASH_RESTORE_NOTE_LIST });
      dispatch(setRefresh());
      dispatch(setMessage('message', ActionTypes.NOTEBOOK_INIT_TRASH_RESTORE_NOTE_LIST));
    }).catch(() => {
      dispatch(setMessage('message', `${ActionTypes.NOTEBOOK_INIT_TRASH_RESTORE_NOTE_LIST}_ERRMSG`, true));
    });
  };
}
