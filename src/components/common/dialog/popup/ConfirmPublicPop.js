import React, { PropTypes } from 'react';
import Popup from '../Popup';

function ConfirmPublicPop(props, context) {
  const { lang } = context;
  const {
    actions: {
      share: { setPublicLink },
      sys: { setPopup },
    },
    sys: { popPara },
  } = props;

  const confirm = {
    enable: true,
    text: lang.btn_yes,
    callback: () => {
      setPublicLink(popPara.publicLink, popPara.publicInfo, popPara);
      setPopup(null);
    },
  };
  const cancel = {
    enable: true,
    text: lang.btn_no,
  };

  return (
    <Popup
      pop="confirm"
      type="remind"
      title={lang.popup_share_set_public_title}
      msg={lang.popup_share_set_public_msg}
      setPopup={setPopup}
      confirm={confirm}
      cancel={cancel}
    />
  );
}

ConfirmPublicPop.contextTypes = {
  lang: PropTypes.object.isRequired,
};

ConfirmPublicPop.propTypes = {
  actions: PropTypes.shape({
    sys: PropTypes.shape({
      setPopup: PropTypes.func.isRequired,
    }),
    share: PropTypes.shape({
      setPublicLink: PropTypes.func.isRequired,
    }),
  }),
  sys: PropTypes.shape({
    popPara: PropTypes.shape({
      publicLink: PropTypes.string.isRequired,
      publicInfo: PropTypes.shape({
        enable: PropTypes.bool.isRequired,
        encrypt: PropTypes.bool,
        password: PropTypes.string,
      }),
      connId: PropTypes.string.isRequired,
      nbId: PropTypes.string,
      secId: PropTypes.string,
      noteId: PropTypes.string,
    }),
  }),
};

export default ConfirmPublicPop;
