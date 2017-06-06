import * as ActionTypes from '../constants/ActionTypes';
import { callApi, requireOption } from '../apis/apiActions';
import { setMessage } from './sysActions';

export function getPublicTreeList(key) {
  return (dispatch, getState) => {
    return callApi(`public_link/${key}`).then(data => {
      dispatch(setPublicTreeList(data));
    }).catch(err => {
      console.error(err);
      dispatch(publicLinkNotFound());
    });
  };
}

export function getPublicNoteInfo(noteId) {
  return (dispatch, getState) => {
    const require = requireOption(null, `public_info/${noteId}`);

    return callApi(require).then(data => {
      dispatch(setPublicNoteInfo(data));
    }).catch(e => {
      dispatch(setMessage('message', 'NOTEBOOK_SET_SELECTED_NOTE_ERRMSG', true));
    });
  };
}

export function decryptPublicNote(key, pwd, errCallback) {
  return (dispatch, getState) => {
    const require = requireOption(null, `public_link/${key}`, 'post', { pass_code: pwd });

    return callApi(require).then(data => {
      dispatch(setPublicNotedecrypt(data));
    }, errCallback.bind(this));
  };
}

function setPublicTreeList(data) {
  return {
    type: ActionTypes.SET_PUBLIC_TREE_LIST,
    payload: {
      data: data.list[0],
      isEncrypt: data.pass_code,
      notFound: false,
    },
  };
}

function publicLinkNotFound() {
  return {
    type: ActionTypes.PUBLIC_LINK_NOT_FOUND,
    payload: {
      notFound: true,
    },
  };
}

function setPublicNotedecrypt(data) {
  return {
    type: ActionTypes.DECRYPT_PUBLIC_NOTE,
    payload: {
      isEncrypt: !data.result
    }
  };
}

function setPublicNoteInfo(data) {
  return {
    type: ActionTypes.SET_PUBLIC_NOTE_INFO,
    payload: {
      noteInfo: data.note_info[0]
    }
  };
}
