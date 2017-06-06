import * as ActionTypes from '../constants/ActionTypes';

const initialState = {
  count: 0,
  message: [],
  isDisplay: false,
};

export function notification(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.NOTIFICATION_REFRESH:
      return {
        ...state,
        ...action.payload,
      };
    case ActionTypes.NOTIFICATION_CHANGE_MENU_STATE:
      return {
        ...state,
        isDisplay: action.payload.state,
      };
    default:
      return state;
  }
}
