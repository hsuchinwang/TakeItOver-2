import * as ActionTypes from '../constants/ActionTypes';

const initialState = {
    /* For Share List*/
  shareSites: {},
  seletSite: 'all',
  defaultShareSiteId: null,
  shareWithMeList: [],
  mySharedDataList: [],
  publishedLinkList: [],
  myContactList: [],
  myPublicLinkInfo: {
    publicLink: null,
    publicTypeList: {
      private: [],
      public: [],
    },
    existLink: null,
    passCode: null,
  },
  shareAccessList: [],
};

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

function formatShareData(type, key, siteInfo, info) {
  const sourceId = key === 'local' ? '-1' : key;
  const sourceType = siteInfo[key].type;
  const userSite = siteInfo[key].user_site;
  const sourceName = siteInfo[key].connection_name;
  switch (type) {
    case 'share':
      return {
        sourceId,
        sourceType,
        userSite,
        id: `${sourceId}${info.nb_id}${info.sec_id}${info.note_id}`,
        displayData: {
          type: changeTypeText(info.type),
          name: info.name,
          startDate: info.create_time,
          sourceName,
        },
        submitData: {
          nb_id: info.nb_id,
          sec_id: info.sec_id,
          note_id: info.note_id,
          type: info.type,
          connId: sourceId,
        },
      };
    case 'shareWithMe':
      return {
        id: `${sourceId}${info.nb_id}${info.sec_id}${info.note_id}`,
        displayData: {
          type: changeTypeText(info.type),
          name: info.name,
          owner: info.owner,
          startDate: info.create_time,
          accessRight: changePermissionText(info.permission),
        },
        submitData: {
          nb_id: info.nb_id,
          sec_id: info.sec_id,
          note_id: info.note_id,
          connId: sourceId,
        },
      };
    case 'publicLink':
      return {
        sourceId,
        sourceType,
        userSite,
        id: `${sourceId}${info.link_id}`,
        displayData: {
          type: changeTypeText(info.type),
          name: info.name,
          startDate: info.create_time,
          password: changePasswordText(info.passcode_protected),
          sourceName,
          link: info.link,
          typeLink: info.public_list || { public: [], private: [] },
        },
        submitData: {
          connId: sourceId,
          nb_id: info.nb_id,
          sec_id: info.sec_id,
          note_id: info.note_id,
          link_id: info.link_id,
        },
        hasPassword: info.passcode_protected === 1,
      };
    default:
      return null;
  }
}

function transformShareListFormat(type, siteInfo, data) {
  const siteKeys = Object.keys(data);
  const result = [];
  for (let i = 0; i < siteKeys.length; i++) {
    const key = siteKeys[i];
    for (let j = 0; j < data[key].length; j++) {
      const info = data[key][j];
      result.push(formatShareData(type, key, siteInfo, info));
    }
  }
  return result;
}

function formatSiteList(data) {
  const siteKeys = Object.keys(data);
  const siteList = {};
  for (let i = 0; i < siteKeys.length; i++) {
    const site = data[siteKeys[i]];
    const {
      connection_name, type, host, port, mount_userid, connectionid, user_site,
    } = site;
    siteList[siteKeys[i] === 'local' ? -1 : connectionid] = {
      type, host, port, mount_userid, user_site,
      name: connection_name,
    };
  }
  return siteList;
}

export default function share(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.SHARE_SET_SITES:
    case ActionTypes.SHARE_SET_SHAREWITHME:
    case ActionTypes.SHARE_SET_MYSHAREDDATA:
    case ActionTypes.SHARE_SET_PUBLISHEDLINK:
    case ActionTypes.SHARE_GET_PUBLIC_LINK:
    case ActionTypes.SHARE_INIT_PUBLIC_LINK:
    case ActionTypes.SHARE_SET_MYCONTACTS:
    case ActionTypes.SHARE_GET_ACCESS_LIST:
    case ActionTypes.SHARE_INIT_SHARE_INFO:
      return { ...state, ...action.payload };
    case ActionTypes.GET_ALL_SHARE_DATA: {
      const { publishedLinks, share: shareData, shareWithMe, siteInfo } = action.payload;
      return {
        ...state,
        shareSites: formatSiteList(siteInfo),
        mySharedDataList: transformShareListFormat('share', siteInfo, shareData),
        shareWithMeList: transformShareListFormat('shareWithMe', siteInfo, shareWithMe),
        publishedLinkList: transformShareListFormat('publicLink', siteInfo, publishedLinks),
      };
    }
    default:
      return state;
  }
}
