import React, { PropTypes } from 'react';

class MountNas extends React.Component {

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
    const { lang } = this.context;
    const { defaultData, editMode } = this.props;
    const name = defaultData && 'connection_name' in defaultData ? defaultData.connection_name : '';
    const host = defaultData && 'host' in defaultData ? defaultData.host : '';
    const userName = defaultData && 'username' in defaultData ? defaultData.username : '';
    const port = defaultData && 'port' in defaultData ? defaultData.port : 443;

    return (
      <div className="mount-nas">
        <div className="row">
          <span className="row-title">{lang.window_mount_nas_field_name}</span>
          <input type="text" className="input-text" ref="mountName" defaultValue={name} autoFocus />
        </div>
        <div className="row">
          <span className="row-title">{lang.window_mount_nas_field_host_ip}</span>
          <input type="text" className="input-text" ref="mountIp" defaultValue={host} onChange={this.handleChange} disabled={!!editMode} />
        </div>
        <div className="row">
          <span className="row-title">{lang.window_mount_nas_field_user_name}</span>
          <input type="text" className="input-text" ref="mountUser" defaultValue={userName} onChange={this.handleChange} disabled={!!editMode} />
        </div>
        <div className="row">
          <span className="row-title">{lang.window_mount_nas_field_password}</span>
          <input type="password" className="input-text" ref="mountPasswd" onChange={this.handleChange} onKeyDown={this.handleKeyDown} />
        </div>
        <div className="row">
          <span className="row-title">{lang.window_mount_nas_field_port}</span>
          <input type="text" defaultValue={port} className="input-text-port" ref="mountPort" onKeyDown={this.handleKeyDown} />
        </div>
        <div className="row">
          <span className="status-msg">{this.state.statusMsg}</span>
        </div>
      </div>
		);
  }
}

export default MountNas;
