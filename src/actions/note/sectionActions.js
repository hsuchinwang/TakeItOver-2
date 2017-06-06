import * as ActionTypes from '../../constants/ActionTypes';
import { callApi, requireOption } from '../../apis/apiActions';
import { getNoteInfo } from './noteActions';
import { setCollapsedItem } from './index';
import { setMessage, setRefresh } from '../sysActions';

import * as nbApi from '../../apis/notebook';
import * as sectionApi from '../../apis/section';
import * as userApi from '../../apis/user';

// FIXME, **need** add error handler
// export function deleteSection(connId, secId, collapsedList) {
//   const tasks = [
//     {
//       deleteSection: sectionApi.deleteSection.bind(this, secId),
//     },
//     {
//       siteMeta: userApi.getSiteMeta,
//       nbList: nbApi.getNotebookBySite,
//       sectionList: sectionApi.getSectionByNotebook,
//     },
//   ];
//   return {
//     type: ActionTypes.TASKCHAIN,
//     payload: {
//       actionType: ActionTypes.NOTE_GET_INFO,
//       connId,
//       tasks,
//       needMask: true,
//     },
//   };
// }

export function getSectionByNotebook(para, newSecId = null) {
  return (dispatch, getState) => {
    const { connId } = para;
    const { user: { siteList } } = getState();
    const siteInfo = (connId in siteList) ? siteList[connId] : null;
    const require = requireOption(siteInfo, 'section', null, { nb_id: para.id });

    return callApi(require).then(data => {
      dispatch(setSecList(connId, para.id, newSecId, data));
    }).catch(e => {
      dispatch(setMessage('message', 'NOTEBOOK_SET_SEC_LIST_ERRMSG', true));
    });
  };
}

export function getSectionListForMoveTo(para) {
  return (dispatch, getState) => {
    const { connId } = para;
    const { user: { siteList } } = getState();
    const siteInfo = (connId in siteList) ? siteList[connId] : null;
    const require = requireOption(siteInfo, 'section/move_list', null, { nb_id: para.id });

    return callApi(require).then(data => {
      dispatch(setMoveToSecList(data));
    }).catch(e => {
      dispatch(setMessage('message', 'NOTEBOOK_SET_SEC_LIST_ERRMSG', true));
    });
  };
}

export function setMoveToNoteBook(para, newNotebook) {
  return (dispatch, getState) => {
    const { connId, nbId, secId } = para;
    const {
      user: { siteList },
      note: { noteInfo, collapsedList }
    } = getState();
    const siteInfo = (connId in siteList) ? siteList[connId] : null;
    const require = requireOption(siteInfo, `section/${secId}/move`, 'put', { nb_id: newNotebook });

    return callApi(require).then(data => {
      dispatch(setRefresh());
      dispatch(setMessage('message', ActionTypes.NOTEBOOK_SET_SECTION_MOVE));
      dispatch(setMoveToOtherNoteBook(para, newNotebook));
      dispatch(getSectionByNotebook({ connId, id: newNotebook }));
      if (collapsedList.indexOf(`${connId}_notebook_${newNotebook}`) < 0) dispatch(setCollapsedItem(`${connId}_notebook_${newNotebook}`));
      if (noteInfo.secId == secId && noteInfo.nbId == nbId) dispatch(getNoteInfo(noteInfo.id, noteInfo.connId));
    }).catch(e => {
      dispatch(setMessage('message', 'NOTEBOOK_SET_SECTION_MOVE_ERRMSG', true));
    });
  };
}

function setMoveToOtherNoteBook(para) {
  return {
    type: ActionTypes.NOTEBOOK_REMOVE_ITEM_FROM_LIST,
    payload: {
      data: {
        connId: para.connId,
        nbId: para.nbId,
        secId: para.secId
      }
    }
  };
}

function setMoveToSecList(data) {
  return {
    type: ActionTypes.NOTEBOOK_SET_MOVE_TO_SEC_LIST,
    payload: {
      data
    }
  };
}

function setSecList(connId, nbId, newSecId, data) {
  let _data = {
    connId,
    nbId,
    data: data.section_list
  };
  if (newSecId != null) {
    _data.renameId = newSecId;
  }
  return {
    type: ActionTypes.NOTEBOOK_SET_SEC_LIST,
    payload: _data
  };
}
