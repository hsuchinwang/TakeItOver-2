import React, { PropTypes } from 'react';
import InputText from '../../../inputText/InputText';

class EncryptNote extends React.Component {

  static contextTypes = {
    lang: PropTypes.object.isRequired,
  };

  static propTypes = {
    snapshotId: PropTypes.string.isRequired,
    connId: PropTypes.string.isRequired,
    unLockSnapshot: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      message: '',
      inputType: 'password',
    };
  }

  unLockFail = () => {
    this.setState({ message: this.context.lang.window_decrypt_note_fail_err });
  };

  handleClick = () => {
    const { snapshotId, connId } = this.props;
    this.props.unLockSnapshot(snapshotId, connId, this.refs.passwdText.value(), this.unLockFail);
  };

  render() {
    const { lang } = this.context;
    return (
      <div className="encrypt-note">
        <div className="decrypt-box">
          <div className="title">
            <div className="icon-sidebar-ic_encrypt" />
            <div className="title-text">{lang.public_view_encrypt_title}</div>
          </div>
          <div className="memo">{lang.public_view_encrypt_description}</div>
          <div className="passwd-text">
            <InputText ref="passwdText" inputType={this.state.inputType} autoFocus />
          </div>
          <div className="err-msg">{this.state.message}</div>
          <div className="btn-box">
            <div className="submit" onClick={this.handleClick} >{lang.btn_confirm}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default EncryptNote;
