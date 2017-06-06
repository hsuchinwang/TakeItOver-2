import { callApi, requireOption } from '../apis/apiActions';
import { setMessage } from './sysActions';
import * as ActionTypes from '../constants/ActionTypes';

export function getTagListFromDB() {
  return (dispatch, getState) => {
    const { user: { siteList } } = getState();
    const siteListKeys = Object.keys(siteList);

    siteListKeys.map((key) => {
      const require = requireOption(siteList[key], 'tag');
      callApi(require).then((data) => {
        dispatch(setTagList(siteList[key], data));
      }).catch(() => {
        dispatch(setMessage('message', 'TAG_GET_LIST_ERRMSG', true));
      });
    });
  };
}

export function renameTagToDB(para) {
  const { name, oldName, connId } = para;
  if (name !== oldName && name !== '') {
    const putPara = {
      tag_name: oldName,
      new_tag_name: name,
    };

    return (dispatch, getState) => {
      const { user: { siteList } } = getState();
      const siteInfo = (connId in siteList) ? siteList[connId] : null;
      const require = requireOption(siteInfo, 'tag', 'put', putPara);

      return callApi(require).then((data) => {
        dispatch(setRename(para, data, true));
        dispatch(setMessage('message', ActionTypes.TAG_SET_RENAME));
      }).catch(() => {
        dispatch(setMessage('message', 'TAG_SET_RENAME_ERRMSG', true));
      });
    };
  }
  para.name = oldName;
  return setRename(para);
}

export function deleteTagFromDB(para) {
  return (dispatch, getState) => {
    const { id, connId } = para;
    const { user: { siteList } } = getState();
    const siteInfo = (connId in siteList) ? siteList[connId] : null;
    const require = requireOption(siteInfo, `tag/${id}`, 'delete');

    return callApi(require).then(data => {
      dispatch(setDeleteTag(para, data));
      dispatch(setMessage('message', 'TAG_DELETE'));
    }).catch(() => {
      dispatch(setMessage('message', 'TAG_DELETE_ERRMSG', true));
    });
  };
}

export function initTagList() {
  return { type: ActionTypes.TAG_SET_INIT_LIST };
}

export function setSelectedTagTreeItem(data) {
  return {
    type: ActionTypes.TAG_SET_SELECT_ITEM,
    payload: {
      selectItemData: data,
    },
  };
}

export function addTagRenameAction(para) {
  return {
    type: ActionTypes.TAG_SET_RENAME_ACTION,
    payload: {
      para,
    },
  };
}

function setRename(para, data = {}, isRename = false) {
  const newOrder = [];
  if (data.tag_list && data.tag_list.length > 0) {
    data.tag_list.map((item) => {
      newOrder.push(item.tag_id);
    });
  }
  return {
    type: ActionTypes.TAG_SET_RENAME,
    payload: {
      para,
      isRename,
      newOrder,
    },
  };
}

function setDeleteTag(para, data = {}) {
  const newOrder = [];
  if (data.tag_list && data.tag_list.length > 0) {
    data.tag_list.map((item) => {
      newOrder.push(item.tag_id);
    });
  }
  return {
    type: ActionTypes.TAG_DELETE,
    payload: {
      para,
      newOrder,
    },
  };
}

function setTagList(siteInfo, data) {
  return {
    type: ActionTypes.TAG_SET_LIST,
    payload: {
      siteInfo,
      tagList: data.tag_list,
    },
  };
}
