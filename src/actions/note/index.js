import * as ActionTypes from '../../constants/ActionTypes';
import { callApi, callApiWithAction, requireOption } from '../../apis/apiActions';
import { setMessage, setRefresh } from '../sysActions';
import { getNoteListBySection, setNoteInfo } from './noteActions';
import { getNoteListByTag } from './tagActions';

export * from './noteActions';
export * from './notebookActions';
export * from './sectionActions';
export * from './tagActions';

export function encryptDecryptNote(noteId, para, callback) {
  return (dispatch, getState) => {
    const { encryptCode, decrypt, connId } = para;
    const { user: { siteList } } = getState();
    const siteInfo = (connId in siteList) ? siteList[connId] : null;
    const params = {
      encrypt_code: encryptCode,
    };
    if (decrypt) params.decrypt = decrypt;

    const require = requireOption(siteInfo, `note/${noteId}/encrypt`, 'post', params);
    dispatch(callApiWithAction(require, callback.succFunc, callback.errorFunc));
  };
}

export function deleteNotesFromDB(para) {
  return (dispatch, getState) => {
    const { type, subType, id, connId } = para;
    const { user: { siteList, userId } } = getState();
    const { collapsedList } = JSON.parse(localStorage.getItem(userId)) || {};
    const siteInfo = (connId in siteList) ? siteList[connId] : null;
    const require = requireOption(siteInfo, `${type}/${id}`, 'delete');
    return callApi(require).then(() => {
      if (type === 'note') {
        if (subType) {
          if (subType === 'tagNote') {
            dispatch(getNoteListByTag(para.tagId, connId));
            dispatch(setRefresh());
            dispatch(setMessage('message', ActionTypes.NOTEBOOK_DELETE_NOTE));
          } else if (subType === 'siteNote') {
            dispatch(setDeleteSiteNote(connId, id));
            dispatch(setRefresh());
            dispatch(setMessage('message', ActionTypes.NOTEBOOK_DELETE_SITENOTE));
          }
        } else {
          dispatch(getNoteListBySection(para.secId, connId));
          dispatch(setRefresh());
          dispatch(setMessage('message', ActionTypes.NOTEBOOK_DELETE_NOTE));
        }
      } else if (type === 'notebook') {
        if (collapsedList && collapsedList instanceof Array) {
          const index = collapsedList.indexOf(`${connId}_notebook_${id}`);
          if (index >= 0) {
            collapsedList.splice(index, 1);
            try {
              localStorage.setItem(userId, JSON.stringify(Object.assign({}, JSON.parse(localStorage.getItem(userId)) || {}, { collapsedList })));
            } catch (err) {
              console.log(err);
            }
          }
        }
        dispatch(setRefresh());
        dispatch(setMessage('message', ActionTypes.NOTEBOOK_DELETE));
      } else if (type === 'section') {
        dispatch(setRefresh());
        dispatch(setMessage('message', ActionTypes.NOTEBOOK_DELETE_SECTION));
      }
    }).catch(() => {
      let msg;
      if (type === 'notebook') msg = 'ERRMSG';
      else if (type === 'section') msg = 'SECTION_ERRMSG';
      else msg = 'NOTE_ERRMSG';
      dispatch(setMessage('message', `NOTEBOOK_DELETE_${msg}`, true));
    });
  };
}

export function addNewToNotebookList(type, para, callback = null) {
  const { connId } = para;
  let apiPath = '';
  const postPara = {};
  let actType = '';

  switch (type) {
    case 'site':
      apiPath = 'notebook';
      actType = ActionTypes.NOTEBOOK_ADD;
      break;
    case 'notebook':
      apiPath = 'section';
      actType = ActionTypes.NOTEBOOK_ADD_SECTION;
      postPara.nb_id = para.id;
      break;
    case 'section':
      apiPath = 'note';
      actType = ActionTypes.NOTEBOOK_ADD_NOTE;
      postPara.sec_id = para.id;
      postPara.nb_id = para.nbId;
      break;
    case 'note':
      apiPath = 'note';
      actType = ActionTypes.NOTEBOOK_ADD_NOTE;
      postPara.sec_id = para.secId;
      postPara.nb_id = para.nbId;
      break;
    default:
  }
  return (dispatch, getState) => {
    const { user: { siteList, userId } } = getState();
    const { collapsedList } = JSON.parse(localStorage.getItem(userId)) || {};
    const siteInfo = (connId in siteList) ? siteList[connId] : null;
    const require = requireOption(siteInfo, apiPath, 'post', postPara);

    return callApi(require).then(data => {
      if (type === 'notebook') {
        if (collapsedList && collapsedList instanceof Array && collapsedList.indexOf(`${connId}_notebook_${para.id}`) < 0) {
          dispatch(setCollapsedItem(`${connId}_notebook_${para.id}`));
        }
        dispatch(setRefresh(null, { para, type, id: data.sec_id }));
      } else if (type === 'site') {
        if (collapsedList && collapsedList instanceof Array && collapsedList.indexOf(`${connId}_site_${para.id}`) < 0) {
          dispatch(setCollapsedItem(`${connId}_site_${para.id}`));
        }
        dispatch(setRefresh(null, { para, type, id: data.nb_id }));
      } else if (type === 'note' || type === 'section') {
        dispatch(getNoteListBySection(postPara.sec_id, connId, data.note_id, true));
        if (callback) callback();
        dispatch(setRefresh());
      }
    }).catch(() => {
      dispatch(setMessage('message', `${actType}_ERRMSG`, true));
    });
  };
}

export function addRenameAction(type, para = {}) {
  return {
    type: ActionTypes.NOTEBOOK_RENAME_ACTION,
    payload: { type, para },
  };
}

export function renameToDB(type, para) {
  const { id, nbId, name, oldName, connId } = para;
  const putPara = {};
  let actType = ActionTypes.NOTEBOOK_SET_RENAME;

  switch (type) {
    case 'notebook':
      actType = ActionTypes.NOTEBOOK_SET_RENAME;
      putPara.nb_name = name;
      break;
    case 'section':
      actType = ActionTypes.NOTEBOOK_SET_RENAME_SECTION;
      putPara.sec_name = name;
      putPara.nb_id = nbId;
      break;
    case 'note':
      actType = ActionTypes.NOTEBOOK_SET_RENAME_NOTE;
      putPara.note_name = name;
      break;
    default:
  }
  if (name !== oldName && name !== '') {
    return (dispatch, getState) => {
      const { user: { siteList } } = getState();
      const siteInfo = (connId in siteList) ? siteList[connId] : null;
      const require = requireOption(siteInfo, `${type}/${id}`, 'put', putPara);
      return callApi(require).then(() => {
        dispatch(setRename(actType, type, para, true));
        switch(type) {
            case 'notebook':
                dispatch(setNoteInfo({
                    nbName: name
                }));
                break;
            case 'section':
                dispatch(setNoteInfo({
                    secName: name
                }));
                break;
            default:
        }
        dispatch(setMessage('message', actType));
      }).catch(() => {
        dispatch(setMessage('message', `${actType}_ERRMSG`, true));
      });
    };
  }
  para.name = oldName;
  return setRename(ActionTypes.NOTEBOOK_RENAME_CANCEL, type, para);
}

export function setSelectedTreeItem(selectItemData) {
  return {
    type: ActionTypes.NOTEBOOK_SET_SELECT_ITEM,
    payload: { selectItemData },
  };
}

export function setCollapsedItem(item) {
  return (dispatch, getState) => {
    const { user: { userId } } = getState();

    dispatch({
      type: ActionTypes.NOTEBOOK_SET_COLLAPSED_ITEM,
      payload: { item, userId },
    });
  };
}

export function setFirstIn(firstIn) {
  return {
    type: ActionTypes.NOTEBOOK_SET_FIRSTIN,
    payload: { firstIn },
  };
}

export function initMoveTo() {
  return {
    type: ActionTypes.NOTEBOOK_SET_MOVE_TO_INIT,
    payload: null,
  };
}

function setAddNew(type, data, id, connId) {
  return {
    type,
    payload: {
      data,
      id,
      connId,
    },
  };
}

function setRename(actType, type, para, rename = false) {
  return {
    type: actType,
    payload: {
      type,
      para,
      rename,
    },
  };
}

function setDeleteNote(noteId) {
  return {
    type: ActionTypes.NOTEBOOK_DELETE_NOTE,
    payload: { noteId },
  };
}

export function setDeleteSiteNote(connId, noteId) {
  return {
    type: ActionTypes.NOTEBOOK_DELETE_SITENOTE,
    payload: { connId, noteId },
  };
}
