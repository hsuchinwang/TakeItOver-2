import * as ActionTypes from '../constants/ActionTypes';

const initialState = {
  sysLang: null,
  fullscreen: false,
  sidebarDisable: false,
  windowType: null, // if value not null to render window dialog
  tabSelected: 0, // window's tab button select, default select first tab
  popType: null, // if value not null to render popup dialog
  windowPara: null,
  popPara: null,
  msgQueue: [],
  errorMessage: {
    enable: false,
  },
  loadingMask: [],
};

export function sys(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.SYS_SET_FULLSCREEN: {
      const isfull = (action.payload.ability) ?
        action.payload.ability : !state.fullscreen;
      return {
        ...state,
        fullscreen: isfull,
      };
    }
    case ActionTypes.SYS_SET_SIDEBAR_DISABLE: {
      return {
        ...state,
        sidebarDisable: action.payload.ability,
      };
    }
    case ActionTypes.SYS_SET_WINDOW: {
      return {
        ...state,
        windowType: action.payload.type,
        tabSelected: action.payload.ind,
        windowPara: action.payload.para,
        errorMessage: { enable: false },
      };
    }
    case ActionTypes.SYS_SET_WINDOW_ERRORMESSAGE:
      return {
        ...state,
        ...action.payload,
      };
    case ActionTypes.SYS_TEB_SELECT:
      return Object.assign({}, state, {
        tabSelected: action.payload.selected,
      });
    case ActionTypes.SYS_SET_POPUP:
      return {
        ...state,
        popType: action.payload.type,
        popPara: action.payload.para,
      };
    case ActionTypes.SYS_SET_MESSAGE:
      state.msgQueue.push(action.payload.data);
      return {
        ...state,
        msgQueue: [...state.msgQueue],
      };
    case ActionTypes.SYS_POP_MESSAGE:
      if (action.payload.popKey) {
        for (const ind in state.msgQueue) {
          if (state.msgQueue[ind].key === action.payload.popKey) {
            state.msgQueue.splice(ind, 1);
            break;
          }
        }
      }
      return {
        ...state,
        msgQueue: [...state.msgQueue],
      };
    case ActionTypes.SYS_TOGGLE_LOADINGMASK: {
      const newLoadingMask = [...state.loadingMask];
      const taskInd = newLoadingMask.indexOf(action.payload.loadingTask);
      if (taskInd >= 0) {
        newLoadingMask.splice(taskInd, 1);
      } else {
        newLoadingMask.push(action.payload.loadingTask);
      }
      return {
        ...state,
        loadingMask: newLoadingMask,
      };
    }
    default:
      return state;
  }
}
