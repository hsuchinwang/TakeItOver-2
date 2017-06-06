import * as ActionTypes from '../constants/ActionTypes';
import { callApi, requestTransformer } from '../apis/apiActions';
import { setMessage } from './sysActions';

function setNotification(message, count = 0) {
  const payload = { count };
  if (message) payload.message = message;
  return {
    type: ActionTypes.NOTIFICATION_REFRESH,
    payload,
  };
}

export function cleanNotification() {
  return (dispatch, getState) => {
    const {
      notification: { message },
    } = getState();
    if (message.length === 0) return;

    const readIds = [];
    message.forEach(value => {
      readIds.push(value.msg_id);
    });

    callApi({
      path: 'msg',
      method: 'delete',
      data: { msg_id: readIds },
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      transformRequest: requestTransformer,
    }).then((res) => {
      let count = 0;
      if (res.list === undefined) return;
      count += res.list.length;
      dispatch(setNotification(null, count));
    }).catch(e => {
      dispatch(setMessage('message', 'NOTIFICATION_CLEAR_ERRMSG', true));
    });
  };
}

export function readNotificationMessage() {
  return (dispatch, getState) => {
    const {
      notification: { message },
    } = getState();
    const readIds = [];

    message.forEach(value => {
      if (value.status == 0) {
        readIds.push(value.msg_id);
      }
    });

    if (readIds.length === 0) return;

    callApi({
      path: 'msg',
      method: 'put',
      params: {
        msg_id: readIds,
        status: 1,
      },
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      transformRequest: requestTransformer,
    }).then((res) => {
      let count = 0;
      if (res.list === undefined) return;
      count += res.list.length;
      dispatch(setNotification(null, count));
    }).catch(e => {
      dispatch(setMessage('message', 'NOTIFICATION_READ_ERRMSG', true));
    });
  };
}

export function refreshNotification() {
  return (dispatch) => {
    callApi('msg').then((res) => {
      let count = 0;
      res.list.forEach(value => {
        if (value.status == 0) count++;
      });
      dispatch(setNotification(res.list, count));
    }).catch(e => {
      dispatch(setMessage('message', 'NOTIFICATION_REFRESH_ERRMSG', true));
    });
  };
}

export function addNotificationMsg(msg) {
  return (dispatch, getState) => {
    try {
      const {
        notification: { message, isDisplay, count },
      } = getState();
      if (isDisplay) {
        message.splice(0, 0, JSON.parse(msg));
        dispatch(setNotification(message, count + 1));
      } else {
        dispatch(setNotification(null, count + 1));
      }
    } catch (e) {
      console.error(e, msg);
    }
  };
}

export function changeNotificationMenuState(state) {
  return {
    type: ActionTypes.NOTIFICATION_CHANGE_MENU_STATE,
    payload: { state },
  };
}
