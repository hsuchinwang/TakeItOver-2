import * as ActionTypes from '../constants/ActionTypes';
import { callApi, requireOption } from '../apis/apiActions';
import { toggleLoadingMask, setWindow, setMessage, setRefresh, setPopup } from './sysActions';

import * as shareApi from '../apis/share';
import * as userApi from '../apis/user';

/** testable **/
export function getSitesMeta() {
  return {
    type: ActionTypes.TASKCHAIN,
    payload: {
      actionType: ActionTypes.GET_ALL_SHARE_DATA,
      runnable: async function() {
        const siteInfo = await userApi.getSiteInfo();
        const share = await shareApi.getAllShareList(siteInfo);
        const shareWithMe = await shareApi.getAllShareWithMe(siteInfo);
        const publishedLinks = await shareApi.getAllPublishedLinks(siteInfo);
        return { siteInfo, share, shareWithMe, publishedLinks };
      },
      options: { needMask: true },
    },
  };
}

export function getMyContactList(connId) {
  return {
    type: ActionTypes.TASKCHAIN,
    payload: {
      actionType: ActionTypes.SHARE_SET_MYCONTACTS,
      options: { connId, needMask: false },
      runnable: async function(siteInfo) {
        const myContactList = await shareApi.getMyContactList(siteInfo);
        return { myContactList };
      },
    },
  };
}

export function getNasUsers(connId) {
  return {
    type: ActionTypes.TASKCHAIN,
    payload: {
      actionType: ActionTypes.SHARE_SET_MYCONTACTS,
      options: { connId, needMask: false },
      runnable: async function(siteInfo) {
        const myContactList = await shareApi.getNasUsers(siteInfo);
        return { myContactList };
      },
    },
  };
}
/** end testable **/

export function getShareData(select, props = { selectListType: ['shareWithMe', 'mySharedData', 'publishedLink'], callback: null }) {
  const { selectListType, callback } = props;
  return (dispatch, getState) => {
    const { share } = getState();
    const passShareObject = {
      shareSites: share.shareSites,
      defaultShareSiteId: share.defaultShareSiteId,
    };
    dispatch(toggleLoadingMask('getShareData'));
    Promise.all(
      selectListType.map((type) => {
        return getData(select, passShareObject, type, dispatch);
      })
    ).then(() => {
      dispatch(toggleLoadingMask('getShareData'));
      callback && callback();
    }).catch(e => {
      dispatch(toggleLoadingMask('getShareData'));
    });
  };
}

export function stopShare(list, type) {
  return (dispatch, getState) => {
    const { share } = getState();
    const requests = Object.keys(list).map(id => {
      const params = { list: JSON.stringify(list[id]) };
      if (type === 'publishedLink') {
        params.action = '0';
      }
      return getUrl({ id, ...share.shareSites[id] }, type, 'patch', params);
    });
    return callApi({ requests, ignoreError: true }).then(response => {
      dispatch(getShareData(share.seletSite, {
        selectListType: [type],
        callback: dispatch.bind(this, setMessage('message', 'SHARE_STOP_SHARE_SUCCESS')),
      }, response));
    });
  };
}

export function cancelPublishedLinkPassword(list) {
  return doPublishedLinkPasswordAction(list, { action: 1 }, 'SHARE_CANCEL_PASSWORD_SUCCESS');
}

export function setPublishedLinkPassword(list, pass_code) {
  return doPublishedLinkPasswordAction(list, { pass_code, action: 2 }, 'SHARE_SET_PASSWORD_SUCCESS');
}

export function editPermisson(sourceId, submitData) {
  return (dispatch) => {
    const data = {};
    if ('nb_id' in submitData && submitData.nb_id) {
      data.nbId = submitData.nb_id;
      data.layer = 3;
    }
    if ('sec_id' in submitData && submitData.sec_id) {
      data.secId = submitData.sec_id;
      data.layer = 2;
    }
    if ('note_id' in submitData && submitData.note_id) {
      data.noteId = submitData.note_id;
      data.layer = 1;
    }

    dispatch(setWindow('ShareWithOthers', null, {
      ...data,
      formType: 'advanced',
      connId: (sourceId == -1) ? 'local' : sourceId,
      edit: true,
    }));
  };
}

function doPublishedLinkPasswordAction(list, props, message) {
  return (dispatch, getState) => {
    const { share } = getState();
    const requests = Object.keys(list).map(id => {
      return getUrl({ id, ...share.shareSites[id] }, 'publishedLink', 'patch', { ...props, list: JSON.stringify(list[id]) });
});
return callApi({ requests, ignoreError: true })
  .then(response => {
    dispatch(getShareData(share.seletSite, {
      selectListType: ['publishedLink'],
      callback: dispatch.bind(this, setMessage('message', message))
    }));
  });
  };
}

function setSites(shareSites, defaultShareSiteId) {
  return {
    type: ActionTypes.SHARE_SET_SITES,
    payload: {
      shareSites,
      defaultShareSiteId
    }
  };
}

/**
 * 取得List資料的callback function
 * @param  {String}   select   使用者選取的 site id
 * @param  {Array}    siteList 當前site的清單，getSitesMeta初始化時會傳入，否則從當前State取的
 * @param  {String}   type     要取得資料的List 名稱
 * @return {Function}          給Redux Promise 的callback function
 */
function getData(select, share, type, dispatch) {
  const { shareSites, defaultShareSiteId } = share;
  const connectionIdList = Object.keys(shareSites);
  const set = setList.bind(this, select, { type, shareSites, defaultShareSiteId }, connectionIdList);
  let passRequest;
  /**
   * 選擇全部的Site，或是單一的site的情形
   * @param  {String} select 使用者選取的 site id，如果是選擇全部的site，該值會為all
   */
  if (select === 'all') {
    passRequest = {
      requests: connectionIdList.map(id => {
        return getUrl({ id, ...shareSites[id] }, type);
      }),
      ignoreError: false,
    };
  } else {
    passRequest = getUrl({ ...shareSites[select], id: select }, type);
  }
  return callApi(passRequest).then(data => {
    dispatch(set(data));
  });
}
/**
 * 根據傳進來的list type回傳相對應的 ACTION 以及 STATE
 * @param {Object}          props         包含type, shareSites, defaultShareSiteId
 * @param {Array 或 Object} callbackData  ajax 回傳的資料結果
 */
function setList(selectSite, props, connectionIdList, callbackData) {
  const { type, shareSites, defaultShareSiteId } = props;
  const list = [];
  const actionType = {
    shareWithMe: 'SHARE_SET_SHAREWITHME',
    mySharedData: 'SHARE_SET_MYSHAREDDATA',
    publishedLink: 'SHARE_SET_PUBLISHEDLINK',
  };
  if (callbackData instanceof Array) {
    callbackData.forEach((data, index) => {
      const sourceId = connectionIdList[index];
      const { name, type: siteType, user_site: userSite } = shareSites[sourceId];
      list.push(
        ...transformListFormat({
          type, sourceId,
          list: data.list,
          sourceName: name,
          sourceType: siteType,
          userSite,
        })
      );
    });
  } else {
    const sourceId = selectSite;
    const { name, type: siteType, user_site: userSite } = shareSites[sourceId];
    list.push(
      ...transformListFormat({
        type, sourceId,
        list: callbackData.list,
        sourceName: name,
        sourceType: siteType,
        userSite,
      })
    );
  }

  return {
    type: actionType[type],
    payload: {
      [`${type}List`]: list,
      selectSite,
    },
  };
}
/**
 * list 轉換成 UI 使用的格式
 * @param  {Object}  props  包含list, type, sourceName, sourceId
 * @return {Array}          轉換後的list
 */
function transformListFormat(props) {
  const { list, type, sourceName, sourceId, sourceType, userSite } = props;
  switch (type) {
    case 'shareWithMe':
      return list.map(item => {
        return {
          id: `${sourceId}${item.nb_id}${item.sec_id}${item.note_id}`,
          displayData: {
            type: changeTypeText(item.type),
            name: item.name,
            owner: item.owner,
            startDate: item.create_time,
            accessRight: changePermissionText(item.permission)
          },
        };
      });
    case 'mySharedData':
      return list.map(item => {
        return {
          sourceId, sourceType, userSite,
          id: `${sourceId}${item.nb_id}${item.sec_id}${item.note_id}`,
          displayData: {
            type: changeTypeText(item.type),
            name: item.name,
            startDate: item.create_time,
            sourceName
          },
          submitData: {
            nb_id: item.nb_id,
            sec_id: item.sec_id,
            note_id: item.note_id,
            type: item.type,
          },
        };
      });
    case 'publishedLink':
      return list.map(item => {
        return {
          sourceId, sourceType, userSite,
          id: `${sourceId}${item.link_id}`,
          displayData: {
            type: changeTypeText(item.type),
            name: item.name,
            startDate: item.create_time,
            password: changePasswordText(item.passcode_protected),
            sourceName,
            link: item.link,
            typeLink: item.public_list || { public: [], private: [] },
          },
          submitData: {
            link_id: item.link_id,
          },
          hasPassword: item.passcode_protected == 1,
        };
      });
  }
}
/**
 * 改變權限名稱
 * @param  {String} value 轉換前名稱
 * @return {String}       轉換後名稱
 */
function changePermissionText(value) {
  switch (value) {
    case '1': return lang_dictionary.share_sheet_access_read_only;
    case '2': return lang_dictionary.share_sheet_access_edit;
    case '3': return lang_dictionary.share_sheet_access_shareable;
  }
}
/**
 * 改變類型名稱
 * @param  {String} value 轉換前名稱
 * @return {String}       轉換後名稱
 */
function changeTypeText(value) {
  switch (value) {
    case '1': return lang_dictionary.general_note;
    case '2': return lang_dictionary.general_section;
    case '3': return lang_dictionary.general_notebook;
  }
}
/**
 * 改變是否有加密的名稱
 * @param  {String} value 轉換前名稱
 * @return {String}       轉換後名稱
 */
function changePasswordText(value) {
  switch (value) {
    case '1': return lang_dictionary.share_sheet_password_on;
    case '0': return lang_dictionary.share_sheet_password_off;
  }
}
/**
 * 取得URL
 * @param  {Object} site        包含 type, id
 * @param  {String} listType    list 的類型
 * @param  {String} method      ajax 的方法
 * @param  {Object} params      傳遞的參數
 * @return {Object}             給ajax的參數
 */
function getUrl(site, listType, method = 'get', params = {}) {
  const { id, type, host, port, mount_userid } = site;
  const path = {
    shareWithMe: 'my/share_with_me',
    mySharedData: 'my/share_list',
    publishedLink: 'my/public_link',
  };
  const returnObject = {
    method,
    path: path[listType],
    type,
  };
  if (Object.keys(params).length !== 0) returnObject.params = { ...params };
  if (type !== 'Default') {
    returnObject.headers = {
      'X-Auth-Userid': mount_userid,
      'X-Auth-Token': id,
    };
    if (type === 'NAS') returnObject.host = host;
    if (port) returnObject.port = port;
  }
  return returnObject;
}

export function setShareWithOthersToDB(list, permission, para, path = null, pathData = {}) {
  const { connId } = para;

  const putData = {};
  if ('nbId' in para) putData.nb_id = para.nbId;
  if ('secId' in para) putData.sec_id = para.secId;
  if ('noteId' in para) putData.note_id = para.noteId;
  putData.users = list;
  putData.permission = permission;

  return (dispatch, getState) => {
    const { user: { siteList } } = getState();
    const siteInfo = (connId in siteList) ? siteList[connId] : null;
    const require = requireOption(siteInfo, 'my/share_list', 'put', putData);
    dispatch(toggleLoadingMask());
    return callApi(require).then(data => {
      if (('invalid_email' in data && data.invalid_email.length > 0) || ('not_myqnapcloud_user' in data && data.not_myqnapcloud_user.length > 0)) {
        dispatch(setPopup('InvalidSharePop', { invalidEmail: data.invalid_email, notMyqnapcloudUser: data.not_myqnapcloud_user }));
      } else if ('not_nas_user' in data && data.not_nas_user.length > 0) {
        dispatch(setPopup('InvalidSharePop', { notNasUser: data.not_nas_user }));
      } else {
        dispatch(setMessage('message', 'SHARE_SET_LIST'));
      }
      dispatch(setRefresh(path, pathData));
      dispatch(setWindow(null));
      dispatch(toggleLoadingMask());
    }).catch(() => {
      dispatch(toggleLoadingMask());
      dispatch(setMessage('message', 'SHARE_SET_LIST_ERRMSG', true));
    });
  };
}

export function setShareAccess(list, para, addShareData, path = null, pathData = {}) {
  const { connId } = para;
  let putData = {};
  putData.share_list = (list.length > 0) ? list : [];
  if ('nbId' in para) putData.nb_id = para.nbId;
  if ('secId' in para) putData.sec_id = para.secId;
  if ('noteId' in para) putData.note_id = para.noteId;

  return (dispatch, getState) => {
    const { user: { siteList } } = getState();
    const siteInfo = (connId in siteList) ? siteList[connId] : null;
    const require = requireOption(siteInfo, 'my/single_share_list', 'put', putData);

    return callApi(require).then(data => {
      const { shareOtherList, sharePermission } = addShareData;
      if (shareOtherList.length > 0) {
        dispatch(setShareWithOthersToDB(shareOtherList, sharePermission, para, path, pathData));
      } else {
        dispatch(setRefresh(path, pathData));
        dispatch(setWindow(null));
        dispatch(setMessage('message', 'SHARE_SET_LIST'));
      }
    }).catch(e => {
      dispatch(setMessage('message', 'SHARE_SET_LIST_ERRMSG', true));
    });
  };
}

export function getAccessList(para) {
  const { connId } = para;
  const params = {};
  if ('nbId' in para) params.nb_id = para.nbId;
  if ('secId' in para) params.sec_id = para.secId;
  if ('noteId' in para) params.note_id = para.noteId;

  return (dispatch, getState) => {
    const { user: { siteList } } = getState();
    const siteInfo = (connId in siteList) ? siteList[connId] : null;
    const require = requireOption(siteInfo, 'my/single_share_list', null, params);

    return callApi(require).then(data => {
      dispatch({
        type: ActionTypes.SHARE_GET_ACCESS_LIST,
        payload: {
          shareAccessList: data.share_list,
        },
      });
    }).catch(() => {
      dispatch(setMessage('message', 'SHARE_GET_ACCESS_LIST_ERRMSG', true));
    });
  };
}

export function createPublicLink(para) {
  const { connId } = para;
  const postData = {};
  if ('nbId' in para) postData.nb_id = para.nbId;
  if ('secId' in para) postData.sec_id = para.secId;
  if ('noteId' in para) postData.note_id = para.noteId;
  return (dispatch, getState) => {
    const { user: { siteList } } = getState();
    const siteInfo = (connId in siteList) ? siteList[connId] : null;
    const require = requireOption(siteInfo, 'my/public_link', 'post', postData);

    return callApi(require).then(data => {
      dispatch({
        type: ActionTypes.SHARE_GET_PUBLIC_LINK,
        payload: {
          myPublicLinkInfo: {
            publicLink: data.public_link,
            publicTypeList: data.public_list || { private: [], public: [] },
            existLink: data.exist_public_link === '' ? null : data.exist_public_link,
            passCode: data.pass_code,
          },
        },
      });
    }).catch(() => {
      dispatch(setMessage('message', 'SHARE_GET_PUBLIC_LINK_ERRMSG', true));
    });
  };
}

export function setPublicLink(link, info, para) {
  const { connId } = para;
  const method = (info.enable) ? 'put' : 'delete';
  const type = (info.enable) ? 'SHARE_SET_PUBLIC_LINK' : 'SHARE_CANCEL_PUBLIC_LINK';

  let putData = {};
  if (link) putData.public_link = link;
  if (info.encrypt && info.password.length > 0) putData.pass_code = info.password;
  if ('nbId' in para) putData.nb_id = para.nbId;
  if ('secId' in para) putData.sec_id = para.secId;
  if ('noteId' in para) putData.note_id = para.noteId;

  return (dispatch, getState) => {
    const { user: { siteList } } = getState();
    const siteInfo = (connId in siteList) ? siteList[connId] : null;
    const require = requireOption(siteInfo, 'my/public_link', method, putData);

    return callApi(require).then(data => {
      dispatch(setWindow(null));
      dispatch(setMessage('message', type));
    }).catch(e => {
      dispatch(setMessage('message', `${type}_ERRMSG`, true));
    });
  };
}

export function initPublicLink() {
  return {
    type: ActionTypes.SHARE_INIT_PUBLIC_LINK,
    payload: {
      myPublicLinkInfo: {
        publicLink: null,
        publicTypeList: {
          private: [],
          public: [],
        },
        existLink: null,
        passCode: null,
      },
    },
  };
}

export function initShareInfo() {
  return {
    type: ActionTypes.SHARE_INIT_SHARE_INFO,
    payload: {
      shareAccessList: [],
      myContactList: [],
    },
  };
}
