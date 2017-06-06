import React, { Component, PropTypes } from 'react';
import Window from '../Window';

class ReConnection extends Component {

  static contextTypes = {
    lang: PropTypes.object.isRequired,
  };

  static propTypes = {
    actions: PropTypes.shape({
      sys: PropTypes.shape({
        setWindow: PropTypes.func.isRequired,
      }),
    }),
    sys: PropTypes.shape({
      windowPara: PropTypes.object.isRequired,
    }),
  };

  constructor(props) {
    super(props);

    this.state = {
      msg: '',
    };
  }

  handleMsg = (msg) => {
    this.setState({ msg });
  };

  handleSubmit = () => {
    const {
      actions: {
        user: { setNasLogin },
      },
    } = this.props;
    const account = this.refs.reConnAcc.value;
    const passwd = this.refs.reConnPwd.value;

    if (account && passwd) setNasLogin(account, passwd, this.handleMsg);
  };

  renderContent = () => {
    const { lang } = this.context;
    const {
      sys: {
        windowPara: { localNas },
      },
    } = this.props;

    if (localNas === true) {
      return (
        <div className="reconnect-field">
          <div className="row message">{lang.window_reconnect_description}</div>
          <div className="row">
            <label className="row-title" htmlFor="reConnAcc">
              {lang.window_mount_nas_field_user_name}
            </label>
            <input
              className="input-text"
              type="text"
              autoFocus
              id="reConnAcc" ref="reConnAcc"
              placeholder={lang.window_mount_nas_field_user_name}
            />
          </div>
          <div className="row">
            <label className="row-title" htmlFor="reConnPwd">
              {lang.window_mount_nas_field_password}
            </label>
            <input
              className="input-text"
              type="password"
              id="reConnPwd"
              ref="reConnPwd"
              placeholder={lang.window_mount_nas_field_password}
            />
          </div>
          <div className="message">{this.state.msg}</div>
        </div>
      );
    }

    return (
      <div className="reconnect-field">
        <div className="row message">{lang.window_reconnect_description}</div>
        <div className="row link"
          onClick={this.props.actions.sys.setWindow.bind(this, 'HybridConnection')}
        >
          {lang.header_more_hybrid_connection}
        </div>
      </div>
    );
  };

  render() {
    const { lang } = this.context;

    return (
      <Window
        type="reConnection"
        title={lang.window_socket_disconnect_title}
        setWindow={this.props.actions.sys.setWindow}
        apply={{
          enable: (this.props.sys.windowPara.localNas === true),
          text: lang.btn_confirm,
          callback: () => {
            this.handleSubmit();
          },
        }}
        cancel={{
          enable: true,
          text: lang.btn_cancel,
          callback: () => {},
        }}
      >
        {this.renderContent()}
      </Window>
    );
  }
}

export default ReConnection;
