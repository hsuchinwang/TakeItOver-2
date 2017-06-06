import React, { PropTypes } from 'react';
import Popup from '../Popup';

function CloseImageEditorAlert(props, context) {
  const { lang } = context;
  const { actions, sys: { popPara } } = props;

  return (
    <Popup
      pop="closeImageEditorAlert"
      type="warning"
      title={lang.popup_closeImageEditorAlert_title}
      msg={lang.popup_closeImageEditorAlert_msg}
      setPopup={actions.sys.setPopup}
      confirm={{
        enable: true,
        text: [lang.btn_save, lang.btn_not_save],
        callback: [
          () => {
            popPara.closeAndSave();
          },
          () => {
            popPara.close();
          },
        ],
      }}
      cancel={{
        enable: true,
        text: lang.btn_cancel,
      }}
    />
  );
}

CloseImageEditorAlert.contextTypes = {
  lang: PropTypes.object.isRequired,
};

CloseImageEditorAlert.propTypes = {
  actions: PropTypes.shape({
    sys: PropTypes.shape({
      setPopup: PropTypes.func.isRequired,
    }),
  }),
  sys: PropTypes.shape({
    popPara: PropTypes.shape({
      closeAndSave: PropTypes.func.isRequired,
      close: PropTypes.func.isRequired,
    }),
  }),
};

export default CloseImageEditorAlert;
