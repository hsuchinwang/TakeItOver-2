import React, { Component, PropTypes } from 'react';

class SnapshotRow extends Component {

  static contextTypes = {
    lang: PropTypes.object.isRequired,
  };

  static propTypes = {
    setPopup: PropTypes.func.isRequired,
    setWindow: PropTypes.func.isRequired,
    handleEditingStatus: PropTypes.func.isRequired,
    setSnapshotRename: PropTypes.func.isRequired,
    setSnapshotDelete: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired,
    noteId: PropTypes.string.isRequired,
    connId: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    createTime: PropTypes.string.isRequired,
    creator: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      rename: false,
      name: props.name,
    };
  }

  setRename = () => {
    this.setState({ rename: true });
    this.props.handleEditingStatus(true);
  };

  handleBlur = () => {
    this.handleRename();
  };

  handleKeyDown = (e) => {
    switch (e.keyCode) {
      case 13: {
        this.handleRename();
        e.preventDefault();
        break;
      }
      default:
        break;
    }
  };

  handleRename = () => {
    const { id, connId, handleEditingStatus } = this.props;
    const { name } = this.state;
    const newName = this.refs.renameField.value;

    if (name !== newName) {
      this.props.setSnapshotRename(id, connId, newName, () => { this.setState({ rename: false, name: newName }); }, () => { this.setState({ rename: false }); });
    } else {
      this.setState({ rename: false });
    }
    handleEditingStatus(false);
  };

  handlePreview = () => {
    const { id, noteId, connId } = this.props;
    this.props.setWindow('SnapshotPreview', 0, { id, connId, noteId });
  };

  handleDelete = () => {
    const { id, connId, noteId } = this.props;

    this.props.setPopup('CommonPop', {
      typeIcon: 'delete',
      title: this.context.lang.general_delete,
      msg: this.context.lang.popup_snapshot_delete_msg,
      confirmCallback: () => {
        this.props.setSnapshotDelete(id, connId, noteId);
      },
    });
  };

  render() {
    const { createTime, creator } = this.props;
    const { name } = this.state;
    const nameField = !this.state.rename ? <div className="origin-name" onClick={this.setRename}>{name}</div> : <input type="text" className="rename" ref="renameField" defaultValue={name} onBlur={this.handleBlur} onKeyDown={this.handleKeyDown} autoFocus />;

    return (
      <div className="sheet-row">
        <div className="sheet-cell name" title={name}>{nameField}</div>
        <div className="sheet-cell datetime" title={createTime}>{createTime}</div>
        <div className="sheet-cell creator" title={creator}>{creator}</div>
        <div className="sheet-cell preview" title={this.context.lang.tooltip_preview}><div className="icon-common-btn_preview_normal" onClick={this.handlePreview} /></div>
        <div className="sheet-cell delete" title={this.context.lang.general_delete}><div className="icon-common-btn_remove_normal" onClick={this.handleDelete} /></div>
      </div>
    );
  }
}

export default SnapshotRow;
