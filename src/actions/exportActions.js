import * as ActionTypes from '../constants/ActionTypes';
import { callApi, requireOption } from '../apis/apiActions';
import { toggleLoadingMask, setMessage, setPopup } from './sysActions';

export function getNotebookList() {
  return (dispatch) => {
    return callApi({
      path: 'notebook/export/notebook_list',
    }).then(data => {
      const list = {};
      data.notebook_list.forEach(item => {
        list[item.nb_id] = {
          title: item.nb_name,
          checked: false,
        };
      });
      dispatch({
        type: ActionTypes.EXPORT_GET_NOTEBOOKLIST,
        payload: { notebookList: list },
      });
    }).catch(() => {
      dispatch(setMessage('message', 'NOTEBOOK_SET_BOOK_LIST_ERRMSG', true));
    });
  };
}

export function initNotebookList() {
  return {
    type: ActionTypes.EXPORT_GET_NOTEBOOKLIST,
    payload: { notebookList: {} },
  };
}

export function exportByDownload(params = {}, callback = null) {
  const { connId } = params;
  return (dispatch, getState) => {
    const { user: { siteList } } = getState();
    const siteInfo = (connId && connId in siteList) ? siteList[connId] : null;
    const require = requireOption(siteInfo, 'notebook/export/site', 'post', params);
    dispatch(toggleLoadingMask('exportByDownload'));
    return callApi(require).then(() => {
      dispatch(toggleLoadingMask('exportByDownload'));
      dispatch(setMessage('message', 'NOTEBOOK_SET_EXPORT'));
      if (callback) setTimeout(() => { callback(); }, 300);
    }).catch(e => {
      if (e.data.status === 403) {
        dispatch(setPopup('CommonPop', {
          typeIcon: 'warning',
          title: window.lang_dictionary.general_folder_permission_denied,
          msg: window.lang_dictionary.general_folder_permission_denied,
          confirmOnly: true,
        }));
      } else dispatch(setMessage('message', 'NOTEBOOK_SET_EXPORT_ERRMSG', true));
      dispatch(toggleLoadingMask('exportByDownload'));
    });
  };
}
