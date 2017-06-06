import React, { PropTypes } from 'react';
import { converNoteContent, connIdNormaliz, getBaseUrl } from '../../../../../common/Utils';

const SnapshotNote = function SnapshotNote(props, context) {

  const {
    saveAs,
    restore,
    compare,
    icon,
    title,
    subTitle,
    parallel,
    connId,
    userInfo: { siteList },
  } = props;
  const noteInfo = Object.assign({}, props);
  if (restore) noteInfo.objContent = undefined;

  // const { host, port } = siteList[connId];
  const connectId = connIdNormaliz(connId);
  // const baseUrl = `http://${host}:${port}/ns/api/v2/note/${connectId}`;
  const baseUrl = getBaseUrl(connId, siteList) + `/ns/api/v2/note/${connectId}`;
  const noteContent = converNoteContent(noteInfo, baseUrl);
  const { lang } = context;

  return (
    <div className="snapshot-note">
      <div className="header">
        <div className="title-box">
          <div className={icon} />
          <div className="title" title={title}>{title}</div>
          { saveAs ? <div className="icon-common-btn_save" title={lang.window_snapshot_save_new} onClick={saveAs} /> : null }
          { restore ? <div className="icon-common-btn_restore" title={lang.window_snapshot_restore} onClick={restore} /> : null }
          { compare ? <div className={parallel ? 'icon-common-btn_extend_normal' : 'icon-common-btn_comparison_normal'} title={lang.window_snapshot_compare} onClick={compare} /> : null }
        </div>
        <div className="subtitle" title={subTitle}>{subTitle}</div>
      </div>
      <div className="content">
        <div className="note-content" dangerouslySetInnerHTML={{ __html: noteContent }} />
      </div>
    </div>
  );
};

SnapshotNote.contextTypes = {
  lang: PropTypes.object.isRequired,
};

SnapshotNote.propTypes = {
  saveAs: PropTypes.func,
  restore: PropTypes.func,
  compare: PropTypes.func,
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  subTitle: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  parallel: PropTypes.bool,
  objContent: PropTypes.object,
  userInfo: PropTypes.object.isRequired,
  connId: PropTypes.string.isRequired,
};

export default SnapshotNote;
