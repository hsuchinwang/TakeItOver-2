import { TASKCHAIN } from '../constants/ActionTypes';
import { toggleLoadingMask, setMessage, setRefresh } from '../actions/sysActions';

function getSiteInfo(store, connId) {
  const { user: { siteList } } = store.getState();
  return (connId in siteList) ? siteList[connId] : null;
}

/**
 * This method will execute the TASKCHAIN of action. The
 * action **must** contains:
 * @params actionType:string
 * @params options:object
 * @params runnable:ayns function
 */
export default store => next => action => {
  if (action.type !== TASKCHAIN) return next(action);

  const { actionType, runnable, options } = action.payload;
  const { connId, needMask, succMsg, refresh } = options;

  if (needMask) next(toggleLoadingMask(actionType));
  runnable(getSiteInfo(store, connId)).then(result => {
    if (needMask) next(toggleLoadingMask(actionType));
    if (result.type) {
      next(result);
    } else {
      if (succMsg) next(setMessage('message', succMsg));
      if (refresh) next(setRefresh(refresh.path || null, refresh.para || {}));
      next({
        type: actionType,
        payload: result,
      });
    }
  }).catch(err => {
    if (needMask) next(toggleLoadingMask(actionType));
    if (err.type) next(setMessage('message', err.errType, true));
    else throw err;
  });
};
