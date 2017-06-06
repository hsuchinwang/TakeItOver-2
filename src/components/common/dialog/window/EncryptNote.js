import React, { Component, PropTypes } from 'react';
import Window from '../Window';

export default class EncryptNote extends Component {

  static contextTypes = {
    lang: PropTypes.object.isRequired,
  };

  static propTypes = {
    actions: PropTypes.shape({
      note: PropTypes.shape({
        encryptDecryptNote: PropTypes.func.isRequired,
      }),
      sys: PropTypes.shape({
        setWindow: PropTypes.func.isRequired,
      }),
    }),
    sys: PropTypes.shape({
      windowPara: PropTypes.shape({
        noteId: PropTypes.string.isRequired,
        connId: PropTypes.string.isRequired,
      }),
    }),
  };

  state = {
    message: '',
  };

  encryptFail = () => {
    const msg = this.context.lang.window_encrypt_note_encrypt_err;
    this.setState({ message: msg });
  };

  encryptSuccess = () => {
    const {
      actions: {
        note: { getNoteInfo },
        sys: { setWindow },
      },
      sys: {
        windowPara: {
          noteId,
          connId,
        },
      },
    } = this.props;
    setWindow(null);
    getNoteInfo(noteId, connId);
  };

  confirmPassword = () => {
    const { lang } = this.context;
    const PWD = this.refs.encryptPWD.value;
    const confirmPWD = this.refs.encryptConfirmPWD.value;
    if (PWD === '' && confirmPWD === '') {
      const msg = lang.window_encrypt_note_empty_err;
      this.setState({ message: msg });
      return;
    }
    if (PWD.length < 6) {
      this.setState({ message: lang.window_encrypt_note_minimum });
      return;
    }
    if (PWD !== confirmPWD) {
      const msg = lang.window_encrypt_note_confirm_err;
      this.setState({ message: msg });
      return;
    }
    const {
      actions: {
        note: { encryptDecryptNote },
      },
      sys: {
        windowPara: {
          noteId,
          connId,
        },
      },
    } = this.props;
    const para = {
      encryptCode: PWD,
      connId,
    };
    const callback = {
      succFunc: this.encryptSuccess,
      errorFunc: this.encryptFail,
    };
    encryptDecryptNote(noteId, para, callback);
  };

  renderPasswordFields = () => {
    const { lang } = this.context;
    return (
      <div className="encryptNote-pwd">
        <div className="row">
          <label className="row-title" htmlFor="encryptPWD">
            {lang.window_encrypt_note_field_password}
          </label>
          <input
            className="input-text"
            type="password"
            autoFocus
            id="encryptPWD" ref="encryptPWD"
            placeholder={lang.window_encrypt_note_placeholder_password}
          />
        </div>
        <div className="row">
          <label className="row-title" htmlFor="encryptConfirmPWD">
            {lang.window_encrypt_note_field_confirm}
          </label>
          <input
            className="input-text"
            type="password"
            id="encryptConfirmPWD"
            ref="encryptConfirmPWD"
            placeholder={lang.window_encrypt_note_placeholder_confirm}
          />
        </div>
        <div className="message">{this.state.message}</div>
      </div>
    );
  };

  render() {
    const { lang } = this.context;
    return (
      <Window
        type="encryptNote"
        title={lang.window_encrypt_note_title}
        setWindow={this.props.actions.sys.setWindow}
        apply={{
          enable: true,
          text: lang.btn_confirm,
          callback: () => {
            this.confirmPassword();
          },
        }}
        cancel={{
          enable: true,
          text: lang.btn_cancel,
          callback: null,
        }}
      >
            {this.renderPasswordFields()}
      </Window>
    );
  }
}
