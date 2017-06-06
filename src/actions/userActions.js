import * as ActionTypes from '../constants/ActionTypes';
import { callApi, requireOption } from '../apis/apiActions';
import { toggleLoadingMask, setMessage, setWindow, setRefresh } from './sysActions';

import * as userApi from '../apis/user';
import * as sysApi from '../apis/sys';
import * as noteApi from '../apis/note';

/** testable **/
export function updateUserInfo(info) {
  return {
    type: ActionTypes.USER_GET_INFO,
    payload: info,
  };
}

export function getInitialData(path) {
  return {
    type: ActionTypes.TASKCHAIN,
    payload: {
      actionType: ActionTypes.USER_SET_INIT_DATA,
      options: { needMask: true },
      runnable: async function(siteInfo) {
        const userInfo = await userApi.getUserInfo(siteInfo);
        const siteList = await userApi.getSiteInfo(siteInfo);
        const language = await sysApi.getLangList(siteInfo);
        const result = { userInfo, siteList, language };
        if (path !== 'section' && path !== 'tagNote' && path !== 'trashcan' &&
            path !== 'important' && path !== 'snapshot') {
          result.noteInfo = await noteApi.getNoteInfo(userInfo.defaultNote, siteInfo);
        }
        return result;
      },
    },
  };
}

export function getSyncList() {
  return {
    type: ActionTypes.TASKCHAIN,
    payload: {
      actionType: ActionTypes.USER_GET_SYNC_LIST,
      options: { needMask: true },
      runnable: async function(siteInfo) {
        const syncList = await userApi.getUserSyncList(siteInfo);
        return { syncList };
      },
    },
  };
}

export function setSyncPolicy(policy, time) {
  return {
    type: ActionTypes.TASKCHAIN,
    payload: {
      actionType: ActionTypes.USER_SET_SYNC_POLICY,
      options: {
        needMask: false,
        succMsg: 'USER_SET_SYNC_POLICY',
      },
      runnable: async function(siteInfo) {
        const result = await userApi.setSyncPolicy(policy, time, siteInfo);
        return { result, policy, time };
      },
    },
  };
}

export function getSyncLog(nbId) {
  return {
    type: ActionTypes.TASKCHAIN,
    payload: {
      actionType: ActionTypes.USER_GET_SYNC_LOG,
      options: { needMask: false },
      runnable: async function(siteInfo) {
        const syncLogs = await userApi.getSyncLog(nbId);
        return { syncLogs };
      },
    },
  };
}

export function deleteSync(settingId, nbId) {
  const runnable = async function(siteInfo) {
    const result = await userApi.deleteSync(settingId, nbId, siteInfo);
    const syncList = await userApi.getUserSyncList(siteInfo);
    return { syncList };
  };
  return {
    type: ActionTypes.TASKCHAIN,
    payload: {
      actionType: ActionTypes.USER_GET_SYNC_LIST,
      options: {
        needMask: false,
        refresh: true,
        succMsg: 'USER_DELETE_SYNC',
      },
      runnable,
    },
  };
}

export function getConnectionList() {
  const tasks = {  };
  return {
    type: ActionTypes.TASKCHAIN,
    payload: {
      actionType: ActionTypes.USER_GET_CONNECTION_LIST,
      runnable: async function(siteInfo) {
        const connectionList = await userApi.getConnectionList(siteInfo);
        return { connectionList };
      },
      options: { needMask: false },
    },
  };
}

export function deleteConnection(connId) {
  const runnable = async function(siteInfo) {
    const result = await userApi.deleteConnection(connId, siteInfo);
    const connectionList = await userApi.getConnectionList(siteInfo);
    const siteList = await userApi.getSiteInfo(siteInfo);
    return { connectionList, siteList };
  };
  return {
    type: ActionTypes.TASKCHAIN,
    payload: {
      actionType: ActionTypes.USER_GET_CONNECTION_LIST,
      runnable,
      options: {
        needMask: false,
        refresh: true,
        succMsg: 'USER_DELETE_CONNECTION',
      },
    },
  };
}

export function setMailSubscribe(params) {
  const runnable = async function(siteInfo) {
    const result = await userApi.setMailSubscribe(params, siteInfo);
    const data = { ...params };
    if ('google_analytics' in params) data.googleAnalytics = params.google_analytics;
    return { result, data };
  };
  return {
    type: ActionTypes.TASKCHAIN,
    payload: {
      actionType: ActionTypes.USER_SET_SETTING,
      runnable,
      options: {
        needMask: false,
        succMsg: 'USER_SET_SETTING',
      },
    },
  };
}
/** end testable **/

export function getUserInfo() {
  return (dispatch) => {
    return callApi('user/loginid').then(response => {
      const { userid, display_name, login_id, avatar, amount_notebook,
          amount_section, amount_note, language, user_usage, user_photo,
          user_level, setting_url, default_nb_id, default_sec_id, nb_id, sec_id, note_id, sync_policy, announce, subscribe, googleAnalytics, migrate } = response;

      dispatch(updateUserInfo({
        language,
        defaultBook: default_nb_id,
        defaultSection: default_sec_id,
        defaultNote: note_id,
        lastViewBook: nb_id,
        lastViewSection: sec_id,
        userId: userid,
        name: display_name,
        email: login_id,
        photo: user_photo,
        avatar,
        level: user_level,
        syncPolicy: sync_policy,
        bookNumber: {
          notebook: amount_notebook,
          section: amount_section,
          note: amount_note,
        },
        usage: user_usage,
        settingUrl: setting_url,
        announce,
        subscribe,
        googleAnalytics,
        migrate: migrate || 0,
      }));
    }).catch(() => {
      dispatch(setMessage('message', 'USER_GET_INFO_ERRMSG', true));
    });
  };
}

export function getSiteInfo() {
  return (dispatch) => {
    return callApi('site/info').then(data => {
      const { site_list } = data;
      let siteList = {};
      for (let i in site_list) {
        const key = (!site_list[i].connectionid && site_list[i].type == 'Default') ? 'local' : site_list[i].connectionid;
        if (!key) continue;
        siteList[key] = site_list[i];
        siteList[key].connectionid = key;
      }

      dispatch({
        type: ActionTypes.USER_GET_SITE_LIST,
        payload: { siteList }
      });
    });
  };
}

export function getLangList() {
  return (dispatch) => {
    return callApi('user/lang').then(data => {
      dispatch({
        type: ActionTypes.USER_GET_LANGLIST,
        payload: { languageList: data.language }
      });
    });
  };
}

export function logout() {
  return (dispatch, getState) => {
    const { user: { userId } } = getState();
    return callApi('user/logout').then(() => {
      localStorage.removeItem(userId);
      location = '/ns/login';
    }).catch(() => {
      dispatch(setMessage('message', 'USER_LOGOUT_ERRMSG', true));
    });
  };
}

export function setLang(lang) {
  return (dispatch) => {
    return callApi({
      path: 'lang',
      method: 'put',
      params: { lang }
    }).then(data => {
      location.reload();
    }).catch(e => {
      dispatch(setMessage('message', 'USER_SET_LANG_ERRMSG', true));
    });
  };
}

export function setTutorialToDB() {
  return (dispatch) => {
    return callApi('user/tutorial').then(data => {
      dispatch(setTutorial());
    });
  };
}

export function setTutorial(tutorial = 0) {
  return {
    type: ActionTypes.USER_SET_TUTORIAL,
    payload: { tutorial },
  };
}

export function getSyncSite() {
  return (dispatch) => callApi({
    path: 'site',
    method: 'get',
    params: { sync: true },
  }).then(data => {
    const { site_list: siteList } = data;
    const syncSiteList = siteList.map(item => ({
      type: item.type,
      conntId: item.connectionid,
      userId: item.mount_userid,
      siteName: item.connection_name,
      host: item.host,
      port: item.port,
    }));

    dispatch({
      type: ActionTypes.USER_GET_SYNC_SITE_LIST,
      payload: { syncSiteList },
    });
  }).catch(() => {
    dispatch(setMessage('message', 'USER_GET_SYNC_SITE_LIST_ERRMSG', true));
  });
}

export function getSyncNotebook(connId) {
  return (dispatch, getState) => {
    const { user: { siteList } } = getState();
    const siteInfo = (connId in siteList) ? siteList[connId] : null;
    const require = requireOption(siteInfo, 'notebook');

    return callApi(require).then(data => {
      const { notebook_list } = data;
      const syncNbList = notebook_list.map(item => ({
        name: item.nb_name,
        id: item.nb_id,
        sync: +item.sync,
      }));

      dispatch({
        type: ActionTypes.USER_GET_SYNC_NOTEBOOK_LIST,
        payload: { syncNbList },
      });
    }).catch(() => {
      dispatch(setMessage('message', 'USER_GET_SYNC_NOTEBOOK_LIST_ERRMSG', true));
    });
  };
}

export function clearSyncNotebook(syncSiteList = false) {
  const initData = {
    syncNbList: [],
  };
  if (syncSiteList) initData.syncSiteList = [];
  return {
    type: ActionTypes.USER_GET_SYNC_NOTEBOOK_LIST,
    payload: { ...initData },
  };
}

export function setSiteSyncNas(params, callback) {
  return (dispatch) => {
    const require = requireOption(null, 'mount/nas', 'post', params);
    return callApi(require).then((response) => {
      dispatch(setMessage('message', 'USER_SET_SYNC_NAS'));
      dispatch(setWindow(null));
    }).catch(e => {
      if (e.response && e.response.status === 400 && (e.response.data.status === 508 || e.response.data.status === 410)) {
        callback(lang_dictionary.window_mount_cloud_msg_exist);
      } else {
        switch (e.status) {
          case 401:
            callback(lang_dictionary.window_mount_cloud_msg_invalid);
            break;
          case 403:
            callback(lang_dictionary.window_site_sync_msg_exist);
            break;
          default:
            dispatch(setMessage('message', 'USER_SET_SYNC_NAS_ERRMSG', true));
        }
      }
    });
  };
}

export function setSiteSyncCloud(params, callback) {
  return (dispatch) => {
    const require = requireOption(null, 'mount/cloud', 'post', params);
    return callApi(require).then((data) => {
      dispatch(setMessage('message', 'USER_SET_SYNC_CLOUD'));
      dispatch(setWindow(null));
    }).catch(e => {
      if (e.response && e.response.status === 400 && (e.response.data.status === 508 || e.response.data.status === 410)) {
        callback(lang_dictionary.window_mount_cloud_msg_exist);
      } else {
        switch (e.status) {
          case 401:
            callback(lang_dictionary.window_mount_cloud_msg_invalid);
            break;
          case 403:
            callback(lang_dictionary.window_site_sync_msg_exist);
            break;
          default:
            dispatch(setMessage('message', 'USER_SET_SYNC_CLOUD_ERRMSG', true));
        }
      }
    });
  };
}

export function setSync(params, callback) {
  return (dispatch) => {
    dispatch(toggleLoadingMask('setSync'));
    const require = requireOption(null, 'sync', 'post', params);
    return callApi(require).then(() => {
      dispatch(toggleLoadingMask('setSync'));
      dispatch(setMessage('message', 'USER_SET_SYNC'));
      dispatch(setRefresh());
      dispatch(setWindow(null));
    }).catch(e => {
      dispatch(toggleLoadingMask('setSync'));
      if (e.data.status == 509) {
        callback(lang_dictionary.window_set_sync_msg_exist);
      } else {
        dispatch(setMessage('message', 'USER_SET_SYNC_ERRMSG', true));
      }
    });
  };
}

export function updateSync(params, callback) {
  return (dispatch) => {
    const require = requireOption(null, 'sync', 'put', params);
    return callApi(require).then(() => {
      dispatch(setMessage('message', 'USER_UPDATE_SYNC'));
      dispatch(setWindow('SyncManager'));
    }).catch(e => {
      if (+e.data.status === 509) callback(lang_dictionary.window_set_sync_msg_exist);
      else dispatch(setMessage('message', 'USER_UPDATE_SYNC_ERRMSG', true));
    });
  };
}

export function updateConnection(params, connId, callback) {
  return (dispatch) => {
    const require = requireOption(null, `site/${connId}`, 'put', params);
    return callApi(require).then(() => {
      dispatch(setMessage('message', 'USER_UPDATE_CONNECTION'));
      dispatch(setWindow('HybridConnection'));
      dispatch(setRefresh());
    }).catch(e => {
      switch (e.status) {
        case 401:
          callback(lang_dictionary.window_mount_cloud_msg_invalid);
          break;
        case 403:
          callback(lang_dictionary.window_site_sync_msg_exist);
          break;
        default:
          dispatch(setMessage('message', 'USER_UPDATE_CONNECTION_ERRMSG', true));
      }
    });
  };
}

// for disconnect dialog use
export function setNasLogin(username, password, callback) {
  return (dispatch) => {
    dispatch(toggleLoadingMask('reconnect'));
    const require = requireOption(null, 'user/nas', 'post', { username, password });
    return callApi(require).then(() => {
      dispatch(toggleLoadingMask('reconnect'));
      dispatch(setWindow(null));
    }).catch(() => {
      dispatch(toggleLoadingMask('reconnect'));
      callback(window.lang_dictionary.view_nas_login_incorrect);
    });
  };
}
