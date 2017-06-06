import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Window from '../Window';
import MountCloud from './mount/MountCloud';
import MountNas from './mount/MountNas';

class Mount extends React.Component {

  static contextTypes = {
    lang: PropTypes.object.isRequired,
    envPlatform: PropTypes.string.isRequired,
  };

  static propTypes = {
    actions: PropTypes.shape({
      sys: PropTypes.shape({
        setWindow: PropTypes.func.isRequired,
        setMountCloud: PropTypes.func.isRequired,
        setMountNas: PropTypes.func.isRequired,
        setTabSelected: PropTypes.func.isRequired,
      }),
    }),
    sys: PropTypes.shape({
      windowType: PropTypes.string.isRequired,
      tabSelected: PropTypes.number,
    }),
  };

  constructor(props, context) {
    super(props);
    this.tabs = [
        {
          title: context.lang.window_mount_tab_nas,
          id: 'nas-mount',
        },
        context.envPlatform !== 'nas' &&
          {
            title: context.lang.window_mount_tab_cloud_notes_station,
            id: 'cloud-mount',
          },
    ].filter((item) => item);
    /*this.state = {
       tabSelected: context.envPlatform === 'nas' ? 1 : props.sys.tabSelected ? props.sys.tabSelected : 0
    }*/
    this.state = {
      tabSelected: (props.sys.tabSelected && props.sys.tabSelected < this.tabs.length) ? this.tabs[props.sys.tabSelected].id : this.tabs[0].id,
    };
  }

  setTabSelected = (tabSelected) => {
    this.setState({ tabSelected });
  };

  validCheck = (form, type) => {
    const { lang } = this.context;

    switch (type) {
      case 'cloud': {
        const account = ReactDOM.findDOMNode(form.refs.mountAccount);
        const passwd = ReactDOM.findDOMNode(form.refs.mountPasswd);

        if (account.value !== '' && passwd.value !== '') {
          this.props.actions.sys.setMountCloud(account.value, passwd.value, form.setStatusMsg);
        } else if (account.value === '') {
          form.setStatusMsg(lang.window_mount_cloud_input_account_err);
          account.focus();
        } else if (passwd.value === '') {
          form.setStatusMsg(lang.window_encrypt_note_empty_err);
          passwd.focus();
        }
        break;
      }
      case 'nas': {
        const name = ReactDOM.findDOMNode(form.refs.mountName).value;
        const ip = ReactDOM.findDOMNode(form.refs.mountIp);
        const user = ReactDOM.findDOMNode(form.refs.mountUser);
        const passwd = ReactDOM.findDOMNode(form.refs.mountPasswd);
        const port = ReactDOM.findDOMNode(form.refs.mountPort).value;

        if (ip.value !== '' && user.value !== '' && passwd.value !== '') {
          this.props.actions.sys.setMountNas(name, ip.value, user.value, passwd.value, port, false, form.setStatusMsg);
        } else if (ip.value === '') {
          form.setStatusMsg(lang.window_mount_nas_input_ip_err);
          ip.focus();
        } else if (user.value === '') {
          form.setStatusMsg(lang.window_mount_nas_input_user_err);
          user.focus();
        } else if (passwd.value === '') {
          form.setStatusMsg(lang.window_encrypt_note_empty_err);
          passwd.focus();
        }
        break;
      }
      default:
    }
  };

  handleSubmit = (type) => {
    let form = null;
    switch (type) {
      case 'cloud':
        form = this.refs.mountCloud;
        break;
      case 'nas':
        form = this.refs.mountNas;
        break;
      default:
    }
    if (form) this.validCheck(form, type);
  };

  render() {
    const { lang } = this.context;
    let content = null;
    let apply = {
      enable: false,
    };
    let cancel = {
      enable: false,
      text: lang.btn_cancel,
    };

    switch (this.state.tabSelected) {
      case 'cloud-mount':
        content = <MountCloud {...this.props} ref="mountCloud" keyDown={this.handleSubmit.bind(this, 'cloud')} />;
        apply = {
          enable: true,
          text: lang.btn_submit,
          callback: this.handleSubmit.bind(this, 'cloud'),
        };
        cancel = {
          enable: true,
          text: lang.btn_cancel,
        };
        break;
      case 'nas-mount':
        content = <MountNas {...this.props} ref="mountNas" keyDown={this.handleSubmit.bind(this, 'nas')} />;
        apply = {
          enable: true,
          text: lang.btn_submit,
          callback: this.handleSubmit.bind(this, 'nas'),
        };
        cancel = {
          enable: true,
          text: lang.btn_cancel,
        };
        break;
      default:
    }
    let tabSelected = this.tabs.reduce((accumulator, currentValue, currentIndex) => {
      return currentValue.id == this.state.tabSelected ? currentIndex : accumulator;
    }, 0);

    return (
      <Window
        type="mount"
        title={lang.window_mount_title}
        tabs={this.tabs}
        selected={tabSelected}
        handleTabSelect={this.setTabSelected}
        setWindow={this.props.actions.sys.setWindow}
        apply={apply}
        cancel={cancel}
      >
        {content}
      </Window>
    );
  }
}

export default Mount;
