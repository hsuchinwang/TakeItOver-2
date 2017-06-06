import * as ActionTypes from '../../constants/ActionTypes';
import { callApi, requireOption } from '../../apis/apiActions';
import { getNoteInfo } from './noteActions';
import { setMessage, setWindow } from '../sysActions';
import { convertTreeList, setListOrder } from '../../common/Utils';

import * as nbApi from '../../apis/notebook';

/** testable **/
export function getSyncInfo(connId, nbId) {
  return {
    type: ActionTypes.TASKCHAIN,
    payload: {
      actionType: ActionTypes.NOTEBOOK_GET_SYNC_INFO,
      options: { connId, needMask: false },
      runnable: async function(siteInfo) {
        const syncInfo = await nbApi.getSyncInfo(nbId, siteInfo);
        return { syncInfo };
      },
    },
  };
}
/** end testable **/


export function getTreeListFromDB(newItem = {}) {
  return (dispatch, getState) => {
    const { user: { siteList, userId }, note: { noteInfo } } = getState();
    const { collapsedList } = JSON.parse(localStorage.getItem(userId)) || {};

    const collapsedData = { local: [] };
    const otherSiteCollapsed = [];
    if (collapsedList && collapsedList instanceof Array) {
      collapsedList.forEach(colItem => {
        const item = colItem.split('_');
        const connId = item[0];
        const itemType = item[1];
        const itemId = item[2];
        if (itemType === 'notebook') {
          if (connId in collapsedData) collapsedData[connId].push(itemId);
          else collapsedData[connId] = [itemId];
        } else if (itemType === 'site' && connId !== 'local') {
          if (!collapsedData[connId]) {
            collapsedData[connId] = [];
          }
          otherSiteCollapsed.push(connId);
        }
      });
    }

    const require = requireOption(null, 'site/meta', 'get', { section_list: collapsedData.local });

    return callApi(require).then(data => {
      const { para, id, type } = newItem;
      const siteTree = {
        list: convertTreeList(data.site_list),
        order: setListOrder(data.site_list, 'connectionid'),
      };
      const requests = [];
      const reqInfo = [];

      for (const key in collapsedData) {
        if (key === 'local' || (key !== 'local' && otherSiteCollapsed.indexOf(key) === -1)) continue;
        const siteInfo = (key in siteList) ? siteList[key] : null;
        if (key in siteTree.list) {
          requests.push(requireOption(siteInfo, 'notebook', 'get', { section_list: collapsedData[key] }));
          reqInfo.push({ connId: key });
        }
      }

      /* handle other site collapsed item */
      if (requests.length > 0) {
        return callApi({ requests, ignoreError: true }).then(response => {
          response.forEach((res, ind) => {
            const { connId } = reqInfo[ind];

            if ('notebook_list' in res) {
              siteTree.list[connId].list = convertTreeList(res.notebook_list, 1, connId);
              siteTree.list[connId].order = setListOrder(res.notebook_list, 'nb_id');
              siteTree.list[connId].order.push(`${connId}-trashcan`);
            }
          });

          if (id && para && type === 'site') siteTree.list[para.connId].list[id].actType = 'rename';
          else if (id && para && type === 'notebook') siteTree.list[para.connId].list[para.id].list[id].actType = 'rename';
          dispatch(setTreeList(siteTree));
          dispatch(getNoteInfo(noteInfo.id, noteInfo.connId));
        });
      }

      if (id && para && type === 'site') {
        siteTree.list[para.connId].list[id].actType = 'rename';
      } else if (id && para && type === 'notebook') {
        siteTree.list[para.connId].list[para.id].list[id].actType = 'rename';
      }
      dispatch(setTreeList(siteTree));
      dispatch(getNoteInfo(noteInfo.id, noteInfo.connId));
    }).catch(e => {
      dispatch(setMessage('message', 'NOTEBOOK_SET_LIST_ERRMSG', true));
    });
  };
}

export function getNotebookBySite(para, newNbId = null) {
  return (dispatch, getState) => {
    const { connId } = para;
    const { user: { siteList } } = getState();
    const siteInfo = (connId in siteList) ? siteList[connId] : null;
    const require = requireOption(siteInfo, 'notebook');

    return callApi(require).then(data => {
      dispatch(setBookList(connId, newNbId, data));
    }).catch(e => {
      if (e.response.status === 401 && e.response.data && e.response.data.status === 101 && connId !== 'local') {
        dispatch(setWindow('HybridConnection'));
      }
      dispatch(setMessage('message', 'NOTEBOOK_SET_BOOK_LIST_ERRMSG', true));
    });
  };
}

export function getNotebookListForMoveTo(para) {
  return (dispatch, getState) => {
    const { connId } = para;
    const { user: { siteList } } = getState();
    const siteInfo = (connId in siteList) ? siteList[connId] : null;
    const require = requireOption(siteInfo, 'notebook/move_list');

    return callApi(require).then(data => {
      dispatch(setMoveToNBList(data));
    }).catch(e => {
      dispatch(setMessage('message', 'NOTEBOOK_SET_BOOK_LIST_ERRMSG', true));
    });
  };
}

function setMoveToNBList(data) {
  return {
    type: ActionTypes.NOTEBOOK_SET_MOVE_TO_BOOK_LIST,
    payload: { data }
  };
}

function setBookList(connId, newNbId, data) {
  const _data = {
    connId,
    data: data.notebook_list,
  };
  if (newNbId != null) {
    _data.renameId = newNbId;
  }
  return {
    type: ActionTypes.NOTEBOOK_SET_BOOK_LIST,
    payload: _data,
  };
}

function setTreeList(data) {
  return {
    type: ActionTypes.NOTEBOOK_SET_LIST,
    payload: { data },
  };
}

export function removeItemFromTreeList(data) {
  return {
    type: ActionTypes.NOTEBOOK_REMOVE_ITEM_FROM_LIST,
    payload: { data },
  };
}

export function clearSyncInfo() {
  return {
    type: ActionTypes.NOTEBOOK_GET_SYNC_INFO,
    payload: { syncInfo: {} },
  };
}
