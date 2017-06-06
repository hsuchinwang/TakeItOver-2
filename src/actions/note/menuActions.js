import * as ActionTypes from '../../constants/ActionTypes';

const buf = {
  menu: null,
  hide: null,
};

export function setMenuWidth(width) {
  return {
    type: ActionTypes.NOTEBOOK_SET_MENU_WIDTH,
    payload: { width },
  };
}

function displayMenu(data, left, top, width) {
  data.left = left;
  data.top = top;
  data.width = width;
  return {
    type: ActionTypes.NOTEBOOK_SET_MENU,
    payload: { data },
  };
}

export function addDisplayEventToBuf(data, left, top, width) {
  if (buf.menu !== null) {
    clearTimeout(buf.menu);
    buf.menu = null;
  }

  return (dispatch) => {
    buf.menu = setTimeout(() => {
      buf.menu = null;
      dispatch(displayMenu(data, left, top, width));
    }, 200);
  };
}

function setHideMenu() {
  return {
    type: ActionTypes.NOTEBOOK_SET_MENU_HIDE,
    payload: {
      show: false,
    },
  };
}

export function addHideEventToBuf(time) {
  if (buf.hide !== null) {
    clearTimeout(buf.hide);
    buf.hide = null;
  }
  if (buf.menu !== null) {
    clearTimeout(buf.menu);
    buf.menu = null;
  }

  return (dispatch) => {
    buf.hide = setTimeout(() => {
      buf.hide = null;
      dispatch(setHideMenu());
    }, time);
  };
}

export function removeHideEventBuf(noteId) {
  if (buf.hide !== null) {
    clearTimeout(buf.hide);
    buf.hide = null;
  }

  return {
    type: ActionTypes.NOTEBOOK_SET_MENU_ALIVE,
    payload: { focus: noteId },
  };
}
