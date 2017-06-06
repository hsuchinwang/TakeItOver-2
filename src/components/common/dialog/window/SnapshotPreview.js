import React, { Component, PropTypes } from 'react';
import Window from '../Window';
import SnapshotNote from './snapshot/SnapshotNote';
import EncryptNote from './snapshot/EncryptNote';

class SnapshotPreview extends Component {

  static contextTypes = {
    lang: PropTypes.object.isRequired,
  };

  static propTypes = {
    actions: PropTypes.shape({
      note: PropTypes.shape({
        initSnapshotInfo: PropTypes.func.isRequired,
        getSnapshot: PropTypes.func.isRequired,
        saveAsSnapshot: PropTypes.func.isRequired,
        restoreSnapshot: PropTypes.func.isRequired,
        unLockSnapshot: PropTypes.func.isRequired,
      }),
      sys: PropTypes.shape({
        setWindow: PropTypes.func.isRequired,
      }),
    }),
    sys: PropTypes.shape({
      windowPara: PropTypes.shape({
        id: PropTypes.string.isRequired,
        connId: PropTypes.string.isRequired,
        noteId: PropTypes.string.isRequired,
      }),
    }),
    note: PropTypes.shape({
      noteInfo: PropTypes.object.isRequired,
      snapshotInfo: PropTypes.object.isRequired,
      snapshotList: PropTypes.array.isRequired,
    }),
    user: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      parallel: false,
    };
  }

  componentWillMount() {
    const {
      sys: {
        windowPara: { id, connId },
      },
    } = this.props;
    this.props.actions.note.getSnapshot(id, connId);
  }

  componentWillUnmount() {
    this.props.actions.note.initSnapshotInfo();
  }

  handleSaveAs = () => {
    const {
      sys: {
        windowPara: { id, connId },
      },
      actions: {
        sys: { setWindow },
        note: { saveAsSnapshot },
      },
    } = this.props;

    saveAsSnapshot(id, connId);
    setWindow(null);
  };

  handleRestore = () => {
    const {
      sys: {
        windowPara: { id, noteId, connId },
      },
      actions: {
        sys: { setWindow },
        note: { restoreSnapshot },
      },
    } = this.props;

    restoreSnapshot(id, noteId, connId);
    setWindow(null);
  };

  handleCompare = () => {
    this.setState({ parallel: !this.state.parallel });
  };

  renderCurrentView = () => {
    if (!this.state.parallel) return null;
    const {
      user,
      note: {
        noteInfo: { name, content, objContent, connId },
      },
    } = this.props;

    return (
      <SnapshotNote
        key="snapshot-current"
        icon="icon-sidebar-ic_note_title"
        title={name}
        subTitle={this.context.lang.general_current_version}
        content={content}
        objContent={objContent}
        userInfo={user}
        connId={connId}
      />
    );
  };

  renderSnapshotView = () => {
    const {
      user,
      note: {
        snapshotInfo: { id, name, creator, encrypt, createTime, content },
        noteInfo: {
          objContent,
          shareInfo: { type, level },
          connId,
        },
      },
    } = this.props;

    if (content) {
      return (
        <SnapshotNote
          key={`snapshot-note-${id}`}
          icon="icon-common-ic_snapshot_title"
          title={name}
          subTitle={`${this.context.lang.window_note_info_item_create_time}: ${createTime}  ${this.context.lang.public_view_note_created_by}: ${creator}`}
          content={content}
          objContent={objContent}
          saveAs={+type === 2 && +level === 1 ? null : this.handleSaveAs}
          restore={this.handleRestore}
          compare={this.handleCompare}
          parallel={this.state.parallel}
          encrypt={(encrypt)}
          userInfo={user}
          connId={connId}
        />
      );
    } else if (+encrypt === 1 && !content) {
      return (
        <EncryptNote
          snapshotId={this.props.sys.windowPara.id}
          connId={this.props.sys.windowPara.connId}
          unLockSnapshot={this.props.actions.note.unLockSnapshot}
        />
      );
    }
    return null;
  };

  render() {
    const {
      sys: {
        windowPara: { noteId, connId },
      },
    } = this.props;

    return (
      <Window
        type="snapshot-preview"
        title={this.context.lang.window_snapshot_preview}
        setWindow={this.props.actions.sys.setWindow}
        apply={{ enable: false }}
        cancel={{
          enable: false,
          callback: () => {
            this.props.actions.sys.setWindow('SnapshotManager', 0, { id: noteId, connId });
          },
        }}
      >
        {this.renderSnapshotView()}
        {this.renderCurrentView()}
      </Window>
    );
  }
}

export default SnapshotPreview;
