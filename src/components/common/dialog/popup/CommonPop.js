import React, { PropTypes } from 'react';
import Popup from '../Popup';

function CommonPop(props, context) {
  const { lang } = context;
  const {
    actions: { sys: { setPopup } },
    sys: {
      popPara: { typeIcon, title, msg, confirmCallback, cancelCallback, confirmOnly, confirmBtnText },
    },
  } = props;

  const confirm = {
    enable: true,
    text: confirmBtnText || lang.btn_confirm,
    callback: () => {
      if (confirmCallback) confirmCallback();
      setPopup(null);
    },
  };
  const cancel = {
    enable: !confirmOnly,
    text: lang.btn_cancel,
    callback: () => {
      if (cancelCallback) cancelCallback();
    },
  };

  return (
    <Popup
      pop="confirm"
      type={typeIcon}
      title={title}
      msg={msg}
      setPopup={setPopup}
      confirm={confirm}
      cancel={cancel}
    />
  );
}

CommonPop.contextTypes = {
  lang: PropTypes.object.isRequired,
};

CommonPop.propTypes = {
  actions: PropTypes.shape({
    sys: PropTypes.shape({
      setPopup: PropTypes.func.isRequired,
    }),
  }),
  sys: PropTypes.shape({
    popPara: PropTypes.shape({
      typeIcon: PropTypes.string.isRequired,   // one of 'Error_but_system_still_can_process', 'charging', 'delete', 'error', 'help', 'info', 'info_blue', 'ok', 'remind', 'warning'
      title: PropTypes.string.isRequired,
      msg: PropTypes.string.isRequired,
      confirmBtnText: PropTypes.string,
      confirmCallback: PropTypes.func,
      cancelCallback: PropTypes.func,
      confirmOnly: PropTypes.bool,
    }),
  }),
};

export default CommonPop;
