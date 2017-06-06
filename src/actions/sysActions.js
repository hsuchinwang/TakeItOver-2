import * as ActionTypes from '../constants/ActionTypes';
import * as NoteAction from './note/index';
import * as TagAction from './tagActions';
import { callApi, requireOption, errorHandle } from '../apis/apiActions';

export function toggleLoadingMask(loadingTask = 'default') {
  return {
    type: ActionTypes.SYS_TOGGLE_LOADINGMASK,
    payload: { loadingTask },
  };
}

export function setFullScreen(ability) {
  return {
    type: ActionTypes.SYS_SET_FULLSCREEN,
    payload: { ability },
  };
}

export function setSideBarDisable(ability) {
  return {
    type: ActionTypes.SYS_SET_SIDEBAR_DISABLE,
    payload: { ability },
  };
}

export function setWindow(type, ind = 0, para = null) {
  return {
    type: ActionTypes.SYS_SET_WINDOW,
    payload: { type, ind, para },
  };
}

export function setWindowErrorMessage(errorMessage) {
  return {
    type: ActionTypes.SYS_SET_WINDOW_ERRORMESSAGE,
    payload: {
      errorMessage: {
        enable: errorMessage !== null,
        text: errorMessage,
      },
    },
  };
}

export function setPopup(type, para) {
  return {
    type: ActionTypes.SYS_SET_POPUP,
    payload: { type, para },
  };
}

export function setTabSelected(selected) {
  return {
    type: ActionTypes.SYS_TEB_SELECT,
    payload: { selected },
  };
}

export function setMigrateNS() {
  return (dispatch) => {
    dispatch(toggleLoadingMask('migrateNS'));
    callApi('sys/migrate')
      .then(data => {
        dispatch(toggleLoadingMask('migrateNS'));
        if (data.result === 'success') window.location.reload();
      })
      .catch(err => {
        dispatch(toggleLoadingMask('migrateNS'));
        throw errorHandle(err, 'SYS_SET_MIGRATE_ERRMSG');
      });
  };
}

export function setMountNas(name, host, username, password, port, rememberPassword, callback) {
  return (dispatch) => {
    dispatch(toggleLoadingMask('mountNas'));
    callApi({
      path: 'mount/nas',
      method: 'post',
      params: { name, username, password, host, rememberPassword, port },
    }).then((data) => {
      const { site_list: siteListInfo } = data; // return new site list info
      let newSite = null;
      const siteList = {};
      for (const i in siteListInfo) {
        const key = (!siteListInfo[i].connectionid && siteListInfo[i].type === 'Default') ? 'local' : siteListInfo[i].connectionid;
        if (!key) continue;
        siteList[key] = siteListInfo[i];
        siteList[key].connectionid = key;
        if (siteListInfo[i].host === host) newSite = siteListInfo[i];  // find new mount site
        if (siteList[key].host === null) {
          siteList[key].host = window._dn;
          siteList[key].port = window._defaultPort || '80';
        }
      }
      dispatch({
        type: ActionTypes.USER_GET_SITE_LIST,
        payload: { siteList },
      });

      if (newSite) {
        dispatch({
          type: ActionTypes.SYS_SET_MOUNT_NAS,
          payload: { newSite },
        });
        dispatch(setMessage('message', ActionTypes.SYS_SET_MOUNT_NAS));
      }
      dispatch(toggleLoadingMask('mountNas'));
      dispatch(setWindow(null));
    }).catch(e => {
      if (e.response && e.response.status === 400 && (e.response.data.status === 508 || e.response.data.status === 410)) {
        callback(lang_dictionary.window_mount_cloud_msg_exist);
      } else {
        switch (e.status) {
          case 203:
            callback(lang_dictionary.window_mount_cloud_msg_invalid);
            break;
          case 403:
            callback(lang_dictionary.window_mount_cloud_msg_exist);
            break;
          default:
            dispatch(setMessage('message', 'SYS_SET_MOUNT_NAS_ERRMSG', true));
        }
      }
      dispatch(toggleLoadingMask('mountNas'));
    });
  };
}

export function setMountCloud(username, password, callback) {
  return (dispatch) => {
    const require = requireOption(null, 'mount/cloud', 'post', { username, password });

    dispatch(toggleLoadingMask('mountCloud'));
    return callApi(require).then((data) => {
      const { site_list: siteListInfo } = data;	// return new site list info
      let newSite = null;
      const siteList = {};
      for (const i in siteListInfo) {
        const key = (!siteListInfo[i].connectionid && siteListInfo[i].type === 'Default') ? 'local' : siteListInfo[i].connectionid;
        if (!key) continue;
        siteList[key] = siteListInfo[i];
        siteList[key].connectionid = key;
        if (siteList[key].host === null) {
          siteList[key].host = window._dn;
          siteList[key].port = window._defaultPort || '80';
        }
        if (siteListInfo[i].connection_name === username) newSite = siteListInfo[i];	// find new mount site
      }
      dispatch({
        type: ActionTypes.USER_GET_SITE_LIST,
        payload: { siteList },
      });

      if (newSite) {
        dispatch({
          type: ActionTypes.SYS_SET_MOUNT_CLOUD,
          payload: { newSite },
        });
        dispatch(setMessage('message', ActionTypes.SYS_SET_MOUNT_CLOUD));
      }
      dispatch(toggleLoadingMask('mountCloud'));
      dispatch(setWindow(null));
    }).catch(e => {
      if (e.response && e.response.status === 400 && (e.response.data.status === 508 || e.response.data.status === 410)) {
        callback(lang_dictionary.window_mount_cloud_msg_exist);
      } else {
        switch (e.status) {
          case 203:
            callback(lang_dictionary.window_mount_cloud_msg_invalid);
            break;
          case 403:
            callback(lang_dictionary.window_mount_cloud_msg_exist);
            break;
          default:
            dispatch(setMessage('message', 'SYS_SET_MOUNT_CLOUD_ERRMSG', true));
        }
      }
      dispatch(toggleLoadingMask('mountCloud'));
    });
  };
}

export function setUnMount(para) {
  return (dispatch, getState) => {
    const { user: { siteList } } = getState();
    const require = requireOption(null, 'mount/site', 'delete', { connectionid: para.connId });

    return callApi(require).then(() => {
      if (para.connId in siteList) delete siteList[para.connId];

      dispatch({
        type: ActionTypes.USER_GET_SITE_LIST,
        payload: { siteList },
      });

      dispatch(NoteAction.removeItemFromTreeList({ connId: para.connId }));
      dispatch(setMessage('message', 'SYS_SET_UNMOUNT_CLOUD'));
    }).catch(() => {
      dispatch(setMessage('message', 'SYS_SET_UNMOUNT_CLOUD_ERRMG', true));
    });
  };
}

export function setMessage(type, msg, err = false, time = 5000) {
  return {
    type: ActionTypes.SYS_SET_MESSAGE,
    payload: {
      data: {
        type,
        msg,
        err,
        time,
        key: Math.floor((Math.random() * 10000) + 10),
      },
    },
  };
}

export function popMessage(popKey = null) {
  return {
    type: ActionTypes.SYS_POP_MESSAGE,
    payload: { popKey },
  };
}

export function setRefresh(path = null, para = {}) {
  let type = '';
  switch (path) {
    case 'section':
      type = ActionTypes.SYS_SET_REFRESH_NOTE;
      break;
    case 'tag':
      type = ActionTypes.SYS_SET_REFRESH_TAG;
      break;
    case 'tagNote':
      type = ActionTypes.SYS_SET_REFRESH_TAGNOTE;
      break;
    case 'search':
      type = ActionTypes.SYS_SET_REFRESH_SEARCH;
      break;
    case 'important':
      type = ActionTypes.SYS_SET_REFRESH_IMPORTANT;
      break;
    default:
      type = ActionTypes.SYS_SET_REFRESH_TREE;
  }

  return {
    type,
    payload: para,
  };
}

export function setGAEvent(category, action, label = null) {
  return {
    type: ActionTypes.SYS_SET_GA,
    payload: { category, action, label },
  };
}

// Set sidebar list item menu action
export function setItemMenuAction(action, popType = '', para = null) {
  switch (action) {
    case 'window':
      return (dispatch) => {
        dispatch(setWindow(popType, 0, para));
      };
    case 'popup':
      return (dispatch) => {
        dispatch(setPopup(popType, para));
      };
    case 'add':
      return (dispatch) => {
        dispatch(NoteAction.addNewToNotebookList(popType, para, 'callback' in para ? para.callback : null));
      };
    case 'rename':
      return (dispatch) => {
        dispatch(NoteAction.addRenameAction(popType, para));
      };
    case 'renameTag':
      return (dispatch) => {
        dispatch(TagAction.addTagRenameAction(para));
      };
  }
}
