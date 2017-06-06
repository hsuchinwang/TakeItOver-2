import React, { Component, PropTypes } from 'react';
import Window from '../Window';

export default class DecryptNote extends Component {

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

  decryptFail = () => {
    const msg = this.context.lang.window_decrypt_note_fail_err;
    this.setState({ message: msg });
  };

  decryptSuccess = () => {
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

  checkPassword = () => {
    const PWD = this.refs.decryptPWD.value;
    if (PWD === '') {
      const msg = this.context.lang.window_decrypt_note_empty_err;
      this.setState({ message: msg });
      return;
    }
    // if (PWD.length < 6) {
    //   this.setState({ message: this.context.lang.window_encrypt_note_minimum });
    //   return;
    // }
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
      decrypt: true,
      connId,
    };
    const callback = {
      succFunc: this.decryptSuccess,
      errorFunc: this.decryptFail,
    };
    encryptDecryptNote(noteId, para, callback);
  };

  renderPasswordFields = () => {
    const { lang } = this.context;
    return (
      <div className="decryptNote-pwd">
        <div className="row">
          <label className="row-title" htmlFor="decryptPWD">
            {lang.window_decrypt_note_field_password}
          </label>
          <input
            className="input-text"
            type="password"
            autoFocus
            id="decryptPWD" ref="decryptPWD"
            placeholder={lang.window_decrypt_note_placeholder_password}
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
        type="decryptNote"
        title={lang.window_decrypt_note_title}
        setWindow={this.props.actions.sys.setWindow}
        apply={{
          enable: true,
          text: lang.btn_confirm,
          callback: () => {
            this.checkPassword();
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
