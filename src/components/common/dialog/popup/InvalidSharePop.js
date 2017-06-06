import React, { PropTypes } from 'react';
import Popup from '../Popup';

function InvalidSharePop(props, context) {
  const { lang } = context;
  const {
    actions: { sys: { setPopup } },
    sys: { popPara: { invalidEmail, notMyqnapcloudUser, notNasUser } },
  } = props;
  const confirm = {
    enable: true,
    text: lang.btn_confirm,
    callback: () => {
      setPopup(null);
    },
  };
  const cancel = { enable: false };
  let invalids = null;
  let notMyqnapUsers = null;
  let notNasUsers = null;

  if (invalidEmail && invalidEmail.length > 0) {
    invalids = (
      <div className="invalid-box" key="mail-invalids">
        <div className="invalid-title">{lang.share_invalid_mail}</div>
        <div className="invalid-content">{invalidEmail.join(', ')}</div>
      </div>
    );
  }
  if (notMyqnapcloudUser && notMyqnapcloudUser.length > 0) {
    notMyqnapUsers = (
      <div className="invalid-box" key="user-invalids">
        <div className="invalid-title">{lang.share_invalid_cloud_user}</div>
        <div className="invalid-content">{notMyqnapcloudUser.join(', ')}</div>
      </div>
    );
  }
  if (notNasUser && notNasUser.length > 0) {
    notNasUsers = (
      <div className="invalid-box" key="nas-user-invalids">
        <div className="invalid-title">{lang.share_invalid_nas_user}</div>
        <div className="invalid-content">{notNasUser.join(', ')}</div>
      </div>
    );
  }

  return (
    <Popup
      pop="invalidShare"
      type="warning"
      title={lang.general_error}
      msg={[invalids, notMyqnapUsers, notNasUsers]}
      setPopup={setPopup}
      confirm={confirm}
      cancel={cancel}
    />
  );
}

InvalidSharePop.contextTypes = {
  lang: PropTypes.object.isRequired,
};

InvalidSharePop.propTypes = {
  actions: PropTypes.shape({
    sys: PropTypes.shape({
      setPopup: PropTypes.func.isRequired,
    }),
  }),
  sys: PropTypes.shape({
    popPara: PropTypes.shape({
      invalidEmail: PropTypes.array,
      notMyqnapcloudUser: PropTypes.array,
      notNasUser: PropTypes.array,
    }),
  }),
};

export default InvalidSharePop;
