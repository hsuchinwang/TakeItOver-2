import * as ActionTypes from '../constants/ActionTypes';
import ErrMsg from '../constants/ErrMsg';

export default store => next => action => {
  if (action.type === ActionTypes.SYS_SET_MESSAGE) {
    const msg = ErrMsg[action.payload.data.msg];
    if (msg) action.payload.data.msg = msg;
  }
  next(action);
};
