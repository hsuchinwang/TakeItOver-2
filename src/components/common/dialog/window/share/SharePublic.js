import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import SwitchButton from '../../../button/SwitchButton';
import DropDownMenu from '../../../dropdown/DropDownMenu';

class SharePublic extends React.Component {

  static contextTypes = {
    lang: PropTypes.object.isRequired,
  };

  static propTypes = {
    link: PropTypes.array,
    passCode: PropTypes.string,
    exist: PropTypes.bool,
    createPublicLink: PropTypes.func.isRequired,
    windowPara: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      copied: false,
      init: true,
      encrypt: false,
      password: null,
      enable: true,
    };
  }

  componentWillMount() {
    this.props.createPublicLink(this.props.windowPara);
  }

  componentDidUpdate() {
    if (this.state.copied) {
      setTimeout(() => {
        this.setState({ copied: false });
      }, 5000);
    }
    if (this.state.enable && this.props.passCode && this.props.passCode !== '' && !this.state.password && this.state.init) {
      this.setState({ password: this.props.passCode, encrypt: true, init: false });
    }
    if (this.state.encrypt && 'publicPasswd' in this.refs) {
      ReactDOM.findDOMNode(this.refs.publicPasswd).value = this.state.password;
      ReactDOM.findDOMNode(this.refs.publicPasswd).focus();
    }
    if (this.state.enable && this.props.exist && this.props.passCode && this.props.passCode !== '') {
      ReactDOM.findDOMNode(this.refs.publicEncrypt).checked = (this.state.encrypt);
    }
  }

  getInfo = () => {
    const { encrypt, password, enable } = this.state;
    return { encrypt, password, enable };
  };

  handleCopy = () => {
    ReactDOM.findDOMNode(this.refs.linkSelect.refs.selectedItem).select();
    document.execCommand('copy');
    this.setState({ copied: true });
  };

  handleChange = (e) => {
    switch (e.target.className) {
      case 'public-password':
        this.setState({ password: e.target.value });
        break;
      case 'public-encrypt':
        this.setState({ encrypt: e.target.checked });
        break;
      default:
    }
  };

  renderHead = () => {
    const { isNas } = this.props;
    if (isNas) {
      return null;
    }
    return (
      <div>{this.context.lang.window_share_public_head}</div>
    );
  };

  renderMsg = () => {
    if (this.state.copied) {
      return (
        <div className="msg-box">
          <div className="msg">{this.context.lang.window_share_public_copied_msg}</div>
        </div>
      );
    }
    return null;
  };

  renderPasswordInput = () => {
    if (this.state.encrypt) {
      return (
        <input type="text" ref="publicPasswd" className="public-password" />
      );
    }
    return null;
  };

  renderSwitchBtn = () => {
    const { exist } = this.props;
    if (!exist) return null;

    const callback = {
      onFunc: () => {
        this.setState({ enable: true });
      },
      offFunc: () => {
        this.setState({ enable: false });
      },
    };

    return (
      <div>
        <SwitchButton ref="publicLinkSwitch" id="publicLinkSwitch" status callback={callback} />
      </div>
    );
  };

  render() {
    const { lang } = this.context;
    const {
      link,
      typeList: { private: privateLink, public: publicLink },
    } = this.props;
    const links = link && link.length > 0 ? link.map(val => {
      let displayName = val;
      if (privateLink.indexOf(val) > -1) displayName = `Private: ${val}`;
      else if (publicLink.indexOf(val) > -1) displayName = `Public: ${val}`;

      return { name: val, value: val, displayName };
    }) : [];

    return (
      <div className="share-public-form">
        {this.renderMsg()}
        {this.renderSwitchBtn()}
        <div className="head-box">
        <div className="head">
          {this.renderHead()}
        </div>
        <div className="btn-copy" onClick={this.handleCopy}>{lang.btn_copy_link}</div>
        </div>
        <div className="link-box" key="linkBox">
        <DropDownMenu className="link" ref="linkSelect" menus={links} selected={0} normal />
        </div>
        <div className={classnames('encrypt-box', { 'qnote-hidden-visibility': (!this.state.enable) })} key="encryptBox" onChange={this.handleChange}>
          <input type="checkbox" className="public-encrypt" ref="publicEncrypt" />
          <div className="text">{lang.window_share_public_require_password}</div>
          {this.renderPasswordInput()}
        </div>
      </div>
    );
  }
}

export default SharePublic;
