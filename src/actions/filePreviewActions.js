import * as ActionTypes from '../constants/ActionTypes';
import { callApi, requireOption } from '../apis/apiActions';
import { toggleLoadingMask, setMessage } from './sysActions';

export function getFileList(targetNode, noteId, connId) {
  return (dispatch, getState) => {
    dispatch(toggleLoadingMask());
    const { user: { siteList } } = getState();
    const siteInfo = (connId in siteList) ? siteList[connId] : null;
    const require = requireOption(siteInfo, `note/${noteId}/preview_list`);

    return callApi(require).then((data) => {
      const reg = /.*\/(.*)\.[jpg|gif|png]/;
      const target = targetNode.attrs.src.match(reg);
      if (!data.preview_list || data.preview_list.length < 1) {
        throw 'No preview_list';
      } else {
        dispatch(setFileList(data));
        for (let i = 0; i < data.preview_list.length; i++) {
          if (target[1] == data.preview_list[i].fileId) {
            dispatch(setFileIndex(i));
            break;
          }
        }
        dispatch(toggleFilePreviewMode());
        dispatch(toggleLoadingMask());
      }
    }).catch(e => {
      dispatch(setMessage('message', 'NOTE_GET_FILE_LIST_ERRMSG', true));
      dispatch(toggleLoadingMask());
    });
  };
}

export function setFileList(data) {
  return {
    type: ActionTypes.FILE_PREVIEW_SET_FILE_LIST,
    payload: {
      fileList: data.preview_list
    }
  };
}
export function setImgOriginSize(data) {
  return {
    type: ActionTypes.FILE_PREVIEW_SET_IMG_ORIGIN_SIZE,
    payload: {
      imgOriginSize: data
    }
  };
}
export function setImgSize(data) {
  return {
    type: ActionTypes.FILE_PREVIEW_SET_IMG_SIZE,
    payload: {
      imgSize: data
    }
  };
}
export function setImgScale(data) {
  return {
    type: ActionTypes.FILE_PREVIEW_SET_IMG_SCALE,
    payload: {
      imgScale: data
    }
  };
}
export function setImgOffset(data) {
  return {
    type: ActionTypes.FILE_PREVIEW_SET_IMG_OFFSET,
    payload: {
      imgOffset: data
    }
  };
}
export function setFileIndex(order) {
  return {
    type: ActionTypes.FILE_PREVIEW_SET_FILE_INDEX,
    payload: {
      fileIndex: order
    }
  };
}
export function setIsResizable(ability) {
  return {
    type: ActionTypes.FILE_PREVIEW_SET_IS_RESIZABLE,
    payload: {
      isResizable: ability
    }
  };
}
export function setIsWindowResized(ability) {
  return {
    type: ActionTypes.FILE_PREVIEW_SET_IS_WINDOW_RESIZE,
    payload: {
      isWindowResized: ability
    }
  };
}
export function setIsToolbarShow(ability) {
  return {
    type: ActionTypes.FILE_PREVIEW_SET_IS_TOOLBAR_SHOW,
    payload: {
      isToolbarShow: ability
    }
  };
}
export function toggleFilePreviewMode() {
  return {
    type: ActionTypes.FILE_PREVIEW_TOGGLE_FILE_PREVIEW
  };
}
export function toggleToolbar() {
  return {
    type: ActionTypes.FILE_PREVIEW_TOGGLE_TOOLBAR
  };
}
export function toggleFileList() {
  return {
    type: ActionTypes.FILE_PREVIEW_TOGGLE_FILE_LIST
  };
}
export function toggleSizeBox() {
  return {
    type: ActionTypes.FILE_PREVIEW_TOGGLE_SIZE_BOX
  };
}
export function initializeFilePreview() {
  return {
    type: ActionTypes.FILE_PREVIEW_INITIALIZE_STATUS
  };
}
