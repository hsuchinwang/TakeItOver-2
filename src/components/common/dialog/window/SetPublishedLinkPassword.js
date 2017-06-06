import React, { Component, PropTypes } from 'react';
import Window from '../Window';
import classnames from 'classnames';

export default class SetPublishedLinkPassword extends Component {

  static contextTypes = {
    lang: PropTypes.object.isRequired,
  };

  static propTypes = {
    actions: PropTypes.shape({
      sys: PropTypes.shape({
        setWindow: PropTypes.func.isRequired,
      }),
      share: PropTypes.shape({
        setPublishedLinkPassword: PropTypes.func.isRequired,
      }),
    }),
    sys: PropTypes.shape({
      windowPara: PropTypes.shape({
        selectSubmitData: PropTypes.array.isRequired,
        clearSelectedItem: PropTypes.func.isRequired,
      }),
    }),
  };

  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      msg: '',
    };
  }

  renderErrorMessage = () => {
    const { hasError, msg } = this.state;
    if (hasError) {
      return <div className="text-error">{msg}</div>;
    }
    return null;
  };

  render() {
    const {
      actions: { sys: { setWindow }, share },
      sys: { windowPara: { selectSubmitData, clearSelectedItem } },
    } = this.props;
    const { lang } = this.context;
    const { hasError } = this.state;
    return (
      <Window type="setPublishedLinkPassword"
        title={lang.window_share_public_pwd_title}
        setWindow={setWindow}
        apply={{
          enable: true,
          text: lang.btn_confirm,
          callback: () => {
            const pVal = this.refs.password.value;
            const cfmVal = this.refs.confirmPassword.value;
            if (!pVal || !cfmVal || pVal !== cfmVal) {
              this.setState({
                hasError: true,
                msg: lang.window_share_public_pwd_confirm_err,
              });
            } else if (pVal.length < 6) {
              this.setState({
                hasError: true,
                msg: lang.window_encrypt_note_minimum,
              });
            } else {
              share.setPublishedLinkPassword(selectSubmitData, pVal);
              clearSelectedItem();
              setWindow(null);
            }
          },
        }}
        cancel={{
          enable: true,
          text: lang.btn_cancel,
        }}
        >
          <div className={classnames({ hasError })}>
            <label htmlFor="password">{lang.window_share_public_pwd_field_password}</label>
            <input ref="password" id="password" type="password"
              placeholder={lang.window_share_public_pwd_placeholder_password}
            />
          </div>
          <div className={classnames({ hasError })}>
            <label htmlFor="confirmPassword">{lang.window_share_public_pwd_field_confirm}</label>
            <input ref="confirmPassword" id="confirmPassword" type="password"
              placeholder={lang.window_share_public_pwd_placeholder_confirm}
            />
          </div>
          {this.renderErrorMessage()}
      </Window>
    );
  }
}
