import * as ActionTypes from '../constants/ActionTypes';
import { callApi } from '../apis/apiActions';
import { toggleLoadingMask, setMessage } from './sysActions';

export function importByUpload(uploadData = null, callback = null) {
  return (dispatch, getState) => {
    dispatch(toggleLoadingMask('importByUpload'));
    return callApi({
      params: uploadData,
      path: 'notebook/import/notebook',
      method: 'post',
    }).then(data => {
      dispatch(toggleLoadingMask('importByUpload'));
      dispatch(setMessage('message', 'NOTEBOOK_SET_IMPORT'));
      callback && setTimeout(() => {callback();}, 300);
    }).catch(e => {
      dispatch(toggleLoadingMask('importByUpload'));
      dispatch(setMessage('message', 'NOTEBOOK_SET_IMPORT_ERRMSG', true));
    });
  };
}
