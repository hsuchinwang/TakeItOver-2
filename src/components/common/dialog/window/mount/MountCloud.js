import React, { PropTypes } from 'react';

class MountCloud extends React.Component {

  static contextTypes = {
    lang: PropTypes.object.isRequired,
  };

  static propTypes = {
    defaultData: PropTypes.object,
    keyDown: PropTypes.func,
    editMode: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.state = { statusMsg: null };
  }

  setStatusMsg = (msg) => {
    this.setState({ statusMsg: msg });
  };

  handleChange = () => {
    this.setState({ statusMsg: null });
  };

  handleKeyDown = (e) => {
    if (e.keyCode === 13) this.props.keyDown();
  };

  render() {
    const { defaultData, editMode } = this.props;
    const name = defaultData && 'connection_name' in defaultData ? defaultData.connection_name : '';

    return (
      <div className="mount-cloud">
        <div className="row">
          <span className="row-title">{this.context.lang.window_mount_nas_field_account}</span>
          <input type="text" className="input-text" ref="mountAccount" defaultValue={name} autoFocus onChange={this.handleChange} disabled={!!editMode} />
        </div>
        <div className="row">
          <span className="row-title">{this.context.lang.window_mount_nas_field_password}</span>
          <input type="password" className="input-text" ref="mountPasswd" onChange={this.handleChange} onKeyDown={this.handleKeyDown} autoFocus={!!editMode} />
        </div>
        <div className="row">
          <span className="status-msg">{this.state.statusMsg}</span>
        </div>
      </div>
    );
  }
}

export default MountCloud;
