import * as ActionTypes from '../constants/ActionTypes';
import { callApi, requireOption } from '../apis/apiActions';
import { toggleLoadingMask, setMessage, setWindow, setPopup } from './sysActions';

function setNasFileList(result) {
  return {
    type: ActionTypes.NAS_SET_FILE_LIST,
    payload: {
      nasFileList: result.file_list || [],
    },
  };
}

function setNasFolderTree(result, dir = '', folderTree) {
  if (folderTree && dir === '') {
    folderTree.rootMap = result['map'] || [];
  } else if (folderTree[dir] && dir !== '') {
    folderTree[dir].hasChild = result['map'] || [];
  } else {
    console.log('setNasFolderTree: wrong data format');
    return;
  }
  result['map'].map((item) => {
    folderTree[item] = result.folder_list[item];
  });

  return {
    type: ActionTypes.NAS_SET_FOLDER_TREE,
    payload: {
      nasFolderTree: folderTree,
    },
  };
}

export function getNasSite() {
  return (dispatch) => {
    const require = requireOption(null, 'site/nas', 'get');
    return callApi(require).then((data) => {
      const nasSiteList = data.site_list.map((item) => (
        {
          connId: item.connectionid,
          connName: item.connection_name,
          local: !!(item.type === 'Default'),
        }
      ));
      dispatch({
        type: ActionTypes.NAS_SET_SITE_LIST,
        payload: {
          nasSiteList,
        },
      });
    }).catch(() => {
      dispatch(setMessage('message', 'NAS_GET_SITE_ERRMSG', true));
    });
  };
}

export function getNasFolderTree(params, dir = '') {
  return (dispatch, getState) => {
    dispatch(toggleLoadingMask());
    const require = requireOption(null, `nas/file_station/folder${dir}`, 'get', params);
    return callApi(require).then((data) => {
      const { nas: { nasFolderTree } } = getState();
      dispatch(setNasFolderTree(data, dir, nasFolderTree));
      dispatch(toggleLoadingMask());
    }).catch(e => {
      if (e.data && e.data.status === 401) {
        dispatch(setWindow('ReConnection', null, { localNas: !params.connectionid }));
      } else if (e.data && e.data.status === 403) {
        dispatch(setPopup('CommonPop', {
          typeIcon: 'warning',
          title: window.lang_dictionary.general_folder_permission_denied,
          msg: window.lang_dictionary.general_folder_permission_denied,
          confirmOnly: true,
        }));
      } else dispatch(setMessage('message', 'NAS_GET_FOLDER_ERRMSG', true));
      dispatch(toggleLoadingMask());
    });
  };
}

export function getNasFileList(params, dir = '') {
  return (dispatch) => {
    const require = requireOption(null, `nas/file_station/file${dir}`, 'get', params);
    return callApi(require).then((data) => {
      dispatch(setNasFileList(data));
    }).catch(e => {
      if (e.data && e.data.status === 401) {
        dispatch(setWindow('ReConnection', null, { localNas: !params.connectionid }));
      } else dispatch(setMessage('message', 'NAS_GET_FILE_ERRMSG', true));
    });
  };
}

export function setNasDir(currentDir = '') {
  return {
    type: ActionTypes.NAS_SET_DIR,
    payload: { currentDir },
  };
}

export function initializeNasFolderFile() {
  return {
    type: ActionTypes.NAS_INIT_FOLDER_FILE,
  };
}
