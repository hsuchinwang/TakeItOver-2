import React, { PropTypes } from 'react';
import Popup from '../Popup';

function UnMount(props, context) {
  const { lang } = context;
  const { name } = props.sys.popPara;
  const title = lang.dropdown_unmount;
  const msg = `${lang.popup_unmout_msg}: ${name} ?`;
  const confirm = {
    enable: true,
    text: lang.btn_confirm,
    callback: () => {
      props.actions.sys.setUnMount(props.sys.popPara);
      props.actions.sys.setPopup(null);
    },
  };
  const cancel = {
    enable: true,
    text: lang.btn_cancel,
  };

  return (
    <Popup
      pop="confirm"
      type="delete"
      title={title}
      msg={msg}
      setPopup={props.actions.sys.setPopup}
      confirm={confirm}
      cancel={cancel}
    />
  );
}

UnMount.contextTypes = {
  lang: PropTypes.object.isRequired,
};

UnMount.propTypes = {
  actions: PropTypes.shape({
    sys: PropTypes.shape({
      setPopup: PropTypes.func.isRequired,
      setUnMount: PropTypes.func.isRequired,
    }),
  }),
  sys: PropTypes.shape({
    popPara: PropTypes.shape({
      name: PropTypes.string.isRequired,
      connId: PropTypes.string.isRequired,
    }),
  }),
};

export default UnMount;
