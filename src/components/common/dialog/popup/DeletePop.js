import React, { PropTypes } from 'react';
import Popup from '../Popup';

function DeletePop(props, context) {
  const { lang } = context;
  const {
    actions: {
      note: { deleteNotesFromDB },
      tag: { deleteTagFromDB },
      sys: { setPopup },
    },
    sys: {
      popPara,
      popPara: { type, name, shareOwner },
    },
  } = props;
  let title;
  const msg = [];

  switch (type) {
    case 'notebook':
      title = `${lang.general_delete}${lang.general_notebook}`;
      msg.push(<div key="deleteMsg">{`${lang.popup_delete_msg}${lang.general_notebook}: ${name} ?`}</div>);
      if (shareOwner) msg.push(<div key="deleteWarning" className="warning">{`${lang.popup_delete_share_warning} ${shareOwner}`}</div>);
      break;
    case 'section':
      title = `${lang.general_delete}${lang.general_section}`;
      msg.push(<div key="deleteMsg">{`${lang.popup_delete_msg}${lang.general_section}: ${name} ?`}</div>);
      if (shareOwner) msg.push(<div key="deleteWarning" className="warning">{`${lang.popup_delete_share_warning} ${shareOwner}`}</div>);
      break;
    case 'note':
      title = `${lang.general_delete}${lang.general_note}`;
      msg.push(<div key="deleteMsg">{`${lang.popup_delete_msg}${lang.general_note}: ${name} ?`}</div>);
      if (shareOwner) msg.push(<div key="deleteWarning" className="warning">{`${lang.popup_delete_share_warning} ${shareOwner}`}</div>);
      break;
    case 'tag':
      title = `${lang.general_delete}${lang.general_tag}`;
      msg.push(<div key="deleteMsg">{`${lang.popup_delete_msg}${lang.general_tag}: ${name} ?`}</div>);
      if (shareOwner) msg.push(<div key="deleteWarning" className="warning">{`${lang.popup_delete_share_warning} ${shareOwner}`}</div>);
      break;
    default:
      break;
  }

  let deleteCallback;
  if (type === 'tag') {
    deleteCallback = deleteTagFromDB.bind(this, popPara);
  } else {
    deleteCallback = deleteNotesFromDB.bind(this, popPara);
  }
  const confirm = {
    enable: true,
    text: lang.btn_confirm,
    callback: () => {
      deleteCallback();
      setPopup(null);
    },
  };
  const cancel = {
    enable: true,
    text: lang.btn_cancel,
  };

  return (
    <Popup
      pop="delete"
      type="delete"
      title={title}
      msg={msg}
      setPopup={setPopup}
      confirm={confirm}
      cancel={cancel}
    />
  );
}

DeletePop.contextTypes = {
  lang: PropTypes.object.isRequired,
};

DeletePop.propTypes = {
  actions: PropTypes.shape({
    sys: PropTypes.shape({
      setPopup: PropTypes.func.isRequired,
    }),
    note: PropTypes.shape({
      deleteNotesFromDB: PropTypes.func.isRequired,
    }),
    tag: PropTypes.shape({
      deleteTagFromDB: PropTypes.func.isRequired,
    }),
  }),
  sys: PropTypes.shape({
    popPara: PropTypes.shape({
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      subType: PropTypes.string,
      connId: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
      tagId: PropTypes.string,
      secId: PropTypes.string,
    }),
  }),
};

export default DeletePop;
