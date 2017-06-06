import React, { PropTypes } from 'react';
import Popup from '../Popup';

function MigrateConfirmPop(props, context) {
  const { lang } = context;
  const {
    actions: { sys: { setPopup } },
    sys: {
      popPara: { confirmCallback, cancelCallback },
    },
  } = props;

  const confirm = {
    enable: true,
    text: lang.btn_confirm,
    callback: () => {
      if (confirmCallback) confirmCallback();
      setPopup(null);
    },
  };
  const cancel = {
    enable: true,
    text: lang.btn_cancel,
    callback: () => {
      if (cancelCallback) cancelCallback();
    },
  };

  const msg = [
    <div key="popup-msg-1">{context.lang.popup_migrate_msg_warn}</div>,
    <div key="popup-msg-2">{context.lang.popup_migrate_msg_check}</div>,
  ];

  return (
    <Popup
      pop="migrate"
      type="warning"
      title=""
      msg={msg}
      setPopup={setPopup}
      confirm={confirm}
      cancel={cancel}
    />
  );
}

MigrateConfirmPop.contextTypes = {
  lang: PropTypes.object.isRequired,
};

MigrateConfirmPop.propTypes = {
  actions: PropTypes.shape({
    sys: PropTypes.shape({
      setPopup: PropTypes.func.isRequired,
    }),
  }),
  sys: PropTypes.shape({
    popPara: PropTypes.shape({
      confirmCallback: PropTypes.func,
      cancelCallback: PropTypes.func,
    }),
  }),
};

export default MigrateConfirmPop;
