import * as ActionTypes from '../constants/ActionTypes';

const initialState = {
  siteList: {},
  userId: null,
  name: null,
  email: null,
  avatar: null,
  color: 'rgb(83, 175, 152)',
  language: null,
  languageList: null,
  photo: null,
  level: null,
  syncPolicy: null,
  syncTime: null,
  announce: null,
  subscribe: null,
  googleAnalytics: null,
  bookNumber: {
    notebook: null,
    section: null,
    note: null,
  },
  usage: null,
  settingUrl: null,
  defaultBook: null,
  defaultSection: null,
  defaultNote: null,
  lastViewBook: null,
  lastViewSection: null,
  tutorial: null,
  isSync: false,
  syncList: [],
  syncLogs: [],
  syncSiteList: [],
  syncNbList: [],
  connectionList: [],
  migrate: 0,
};

export function user(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.USER_SET_INIT_DATA:
      return Object.assign({}, state, {
        ...action.payload.userInfo,
        siteList: action.payload.siteList,
        languageList: action.payload.language,
      });
    case ActionTypes.USER_GET_INFO:
    case ActionTypes.USER_GET_SITE_LIST:
    case ActionTypes.USER_GET_LANGLIST:
    case ActionTypes.USER_SET_TUTORIAL:
    case ActionTypes.USER_GET_SYNC_NOTEBOOK_LIST:
    case ActionTypes.USER_GET_SYNC_SITE_LIST:
    case ActionTypes.USER_GET_SYNC_LIST:
    case ActionTypes.USER_GET_SYNC_LOG:
    case ActionTypes.USER_GET_CONNECTION_LIST:
      return Object.assign({}, state, { ...action.payload });
    case ActionTypes.USER_SET_SYNC_POLICY:
      if (action.payload.result === true) return Object.assign({}, state, { syncPolicy: action.payload.policy, syncTime: action.payload.time });
      return state;
    case ActionTypes.USER_SET_SETTING:
      if (action.payload.result === 'success') return Object.assign({}, state, { ...action.payload.data });
      return state;
    default:
      return state;
  }
}
