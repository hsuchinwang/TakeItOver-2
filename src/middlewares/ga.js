import * as ActionTypes from '../constants/ActionTypes';

export default store => next => action => {
	const { user: { googleAnalytics } } = store.getState();

  if (action.type === ActionTypes.SYS_SET_GA) {
    if (googleAnalytics && +googleAnalytics === 1) ga('send', 'event', action.payload.category, action.payload.action, action.payload.label);
    return;
  }
  next(action);
};
