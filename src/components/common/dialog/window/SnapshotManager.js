import React, { Component, PropTypes } from 'react';
import Window from '../Window';
import SnapshotRow from './snapshot/SnapshotRow';

class SnapshotManager extends Component {

  static contextTypes = {
    lang: PropTypes.object.isRequired,
  };

  static propTypes = {
    actions: PropTypes.shape({
      note: PropTypes.shape({
        getSnapshotList: PropTypes.func.isRequired,
        setSnapshotList: PropTypes.func.isRequired,
        setSnapshotRename: PropTypes.func.isRequired,
        setSnapshotDelete: PropTypes.func.isRequired,
      }),
      sys: PropTypes.shape({
        setPopup: PropTypes.func.isRequired,
        setWindow: PropTypes.func.isRequired,
      }),
    }),
    sys: PropTypes.shape({
      windowPara: PropTypes.shape({
        id: PropTypes.string.isRequired,
        connId: PropTypes.string.isRequired,
      }),
    }),
    note: PropTypes.shape({
      snapshotList: PropTypes.array.isRequired,
    }),
  };

  constructor(props) {
    super(props);
    this.state = {
      rename: false,
    };
  }

  componentWillMount() {
    const {
      sys: {
        windowPara: { id, connId },
      },
    } = this.props;
    this.props.actions.note.getSnapshotList(id, connId);
  }

  componentWillUnmount() {
    this.props.actions.note.setSnapshotList();
  }

  handleEditingStatus = (rename) => {
    this.setState({ rename });
  };

  renderSnapshots = () => {
    const {
      actions: {
        note: {
          setSnapshotRename,
          setSnapshotDelete,
        },
        sys: { setPopup, setWindow },
      },
      note: { snapshotList },
      sys: {
        windowPara: { id, connId },
      },
    } = this.props;

    if (snapshotList.length === 0) return <div className="empty">{this.context.lang.general_empty_data}</div>;

    return snapshotList.map(val => {
      return (
        <SnapshotRow
          key={`snapshot-item-${val.snapshot_id}`}
          setPopup={setPopup}
          setWindow={setWindow}
          handleEditingStatus={this.handleEditingStatus}
          setSnapshotRename={setSnapshotRename}
          setSnapshotDelete={setSnapshotDelete}
          id={val.snapshot_id}
          noteId={id}
          connId={connId}
          name={val.snapshot_name}
          createTime={val.snapshot_create_time}
          creator={val.snapshot_creator}
        />
      );
    });
  };

  render() {
    const { lang } = this.context;
    const name = this.state.rename ? `${lang.window_snapshot_name} (${lang.general_editing}...)` : lang.window_snapshot_name;

    return (
      <Window
        type="snapshot-manager"
        title={lang.general_snapshot_manager}
        setWindow={this.props.actions.sys.setWindow}
        apply={{ enable: false }}
        cancel={{ enable: false }}
      >
        <div className="sheet">
          <div className="sheet-row header">
            <div className="sheet-cell name">{name}</div>
            <div className="sheet-cell datetime">{lang.window_note_info_item_create_time}</div>
            <div className="sheet-cell creator">{lang.public_view_note_created_by}</div>
            <div className="sheet-cell action"></div>
            <div className="sheet-cell action"></div>
          </div>
        </div>
        <div className="sheet">
          { this.renderSnapshots() }
        </div>
      </Window>
    );
  }
}

export default SnapshotManager;
