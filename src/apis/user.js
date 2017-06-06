import { callApi, requireOption, errorHandle } from './apiActions';

export function getUserInfo(siteInfo) {
  const options = requireOption(siteInfo, 'user/loginid');
  return callApi(options).then(res => ({
    language: res.language,
    defaultBook: res.default_nb_id,
    defaultSection: res.default_sec_id,
    defaultNote: res.note_id,
    lastViewBook: res.nb_id,
    lastViewSection: res.sec_id,
    userId: res.userid,
    name: res.display_name,
    email: res.login_id,
    photo: res.user_photo,
    avatar: res.avatar,
    level: res.user_level,
    syncPolicy: res.sync_policy,
    syncTime: res.sync_time,
    bookNumber: {
      notebook: res.amount_notebook,
      section: res.amount_section,
      note: res.amount_note,
    },
    usage: res.user_usage,
    settingUrl: res.setting_url,
    tutorial: res.tutorial,
    announce: res.announce,
    subscribe: res.subscribe,
    googleAnalytics: res.google_analytics,
    migrate: res.migrate || 0,
  }))
  .catch(err => { throw errorHandle(err, 'USER_GET_INFO_ERRMSG'); });
}

export function getSiteInfo() {
  return callApi('site/info')
    .then(res => {
      const siteList = {};
      for (let i = 0; i < res.site_list.length; i++) {
        let key;
        if (!res.site_list[i].connectionid && res.site_list[i].type === 'Default') {
          key = 'local';
        } else {
          key = res.site_list[i].connectionid;
        }
        if (!key) continue;
        siteList[key] = res.site_list[i];
        siteList[key].connectionid = key;
        if (siteList[key].host === null) {
          siteList[key].host = window._dn;
          siteList[key].port = window._defaultPort || '80';
        }
      }
      return siteList;
    })
    .catch(err => { throw errorHandle(err, 'USER_GET_SITE_LIST_ERRMSG'); });
}

export function getSiteMeta() {
  return callApi('site/meta')
    .then(data => data.site_list)
    .catch(err => {
      console.error(err);
    });
}

export function setSyncAll() {
  return callApi({
    path: 'sync/process',
    method: 'get',
  })
    .then(data => data.result)
    .catch(err => { throw errorHandle(err, 'USER_SET_SYNC_ALL_ERRMSG'); });
}

export function getUserSyncList() {
  return callApi('sync')
    .then(data => data.list)
    .catch(err => { throw errorHandle(err, 'USER_GET_SYNC_LIST_ERRMSG'); });
}

export function setSyncPolicy(syncPolicy, syncTime) {
  const Time = syncTime === 0 ? false : syncTime;
  return callApi({
    path: 'user/sync_policy',
    method: 'put',
    params: { sync_policy: syncPolicy, sync_time: Time },
  })
    .then(data => data.result)
    .catch(err => { throw errorHandle(err, 'USER_SET_SYNC_POLICY_ERRMSG'); });
}

export function getSyncLog(nbId) {
  return callApi(`sync/${nbId}/log`)
    .then(data => data.list)
    .catch(err => { throw errorHandle(err, 'USER_GET_SYNC_LOG_ERRMSG'); });
}

export function deleteSync(settingId, nbId) {
  return callApi({
    path: 'sync',
    method: 'delete',
    params: { setting_id: settingId, nb_id: nbId },
  })
    .then(data => data.result)
    .catch(err => { throw errorHandle(err, 'USER_DELETE_SYNC_ERRMSG'); });
}

export function updateSync(params) {
  return callApi({
    path: 'sync',
    method: 'put',
    params,
  })
    .then(data => data.result)
    .catch(err => { throw errorHandle(err, 'USER_UPDATE_SYNC_ERRMSG'); });
}

export function getConnectionList() {
  return callApi('site')
    .then(data => data.site_list)
    .catch(err => { throw errorHandle(err, 'USER_GET_CONNECTION_ERRMSG'); });
}

export function deleteConnection(connectionid) {
  return callApi({
    path: 'mount/site',
    method: 'delete',
    params: { connectionid },
  })
    .then(data => data.result)
    .catch(err => { throw errorHandle(err, 'USER_DELETE_CONNECTION_ERRMSG'); });
}

export function updateCloudConnection(connId) {
  return callApi({
    path: `site/cloud/${connId}`,
    method: 'put',
    params: {

    },
  })
    .then(data => data.result)
    .catch(err => { throw errorHandle(err, 'USER_UPDATE_CONNECTION_ERRMSG'); });
}

export function updateNasConnection(connId) {
  return callApi({
    path: `site/nas/${connId}`,
    method: 'put',
    params: {

    },
  })
    .then(data => data.result)
    .catch(err => { throw errorHandle(err, 'USER_UPDATE_CONNECTION_ERRMSG'); });
}

export function setMailSubscribe(params) {
  return callApi({
    path: 'user/email',
    method: 'get',
    params,
  })
    .then(data => data.result)
    .catch(err => { throw errorHandle(err, 'USER_SET_SETTING_ERRMSG'); });
}
