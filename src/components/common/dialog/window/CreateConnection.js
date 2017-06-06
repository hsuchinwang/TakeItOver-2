import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Window from '../Window';
import MountCloud from './mount/MountCloud';
import MountNas from './mount/MountNas';

class CreateConnection extends React.Component {

  static contextTypes = {
    lang: PropTypes.object.isRequired,
    envPlatform: PropTypes.string.isRequired,
  };

  static propTypes = {
    actions: PropTypes.shape({
      sys: PropTypes.shape({
        setWindow: PropTypes.func.isRequired,
      }),
      user: PropTypes.shape({
        setSiteSyncCloud: PropTypes.func.isRequired,
        setSiteSyncNas: PropTypes.func.isRequired,
      }),
    }),
    sys: PropTypes.shape({
      windowPara: PropTypes.shape({
        connId: PropTypes.string,
        edit: PropTypes.string,
        parent: PropTypes.string,
        parentPara: PropTypes.object,
      }),
      windowType: PropTypes.string.isRequired,
      tabSelected: PropTypes.number,
    }),
  };

  constructor(props, context) {
    super(props);
    const {
      windowPara: { edit },
    } = props.sys;
    this.tabs = [
        {
          title: context.lang.window_connection_tab_nas,
          id: 'syncNas',
        },
        context.envPlatform !== 'nas' &&
          {
            title: context.lang.window_connection_tab_cloud,
            id: 'syncCloud',
          },
    ].filter((item) => item);
    this.state = {
      tabSelected: (props.sys.tabSelected && props.sys.tabSelected < this.tabs.length) ? this.tabs[props.sys.tabSelected].id : this.tabs[0].id,
    };
  }

  handleTabSelect = (tabSelected) => {
    this.setState({ tabSelected });
  };

  validCheck = (form, type) => {
    const { lang } = this.context;
    const {
      sys: {
        windowPara: { connId, edit },
      },
      actions: {
        user: {
          setSiteSyncCloud,
          setSiteSyncNas,
          updateConnection,
        },
      },
    } = this.props;

    switch (type) {
      case 'cloud': {
        const account = ReactDOM.findDOMNode(form.refs.mountAccount);
        const passwd = ReactDOM.findDOMNode(form.refs.mountPasswd);

        if (account.value !== '' && passwd.value !== '') {
          const params = {
            username: account.value,
            password: passwd.value,
            setting: 1,
            connection_type: 'cloud',
          };
          if (edit) updateConnection(params, connId, form.setStatusMsg);
          else setSiteSyncCloud(params, form.setStatusMsg);
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
          const params = {
            name,
            host: ip.value,
            username: user.value,
            password: passwd.value,
            port,
            rememberPassword: false,
            setting: 1,
            connection_type: 'nas',
          };
          if (edit) updateConnection(params, connId, form.setStatusMsg);
          else setSiteSyncNas(params, form.setStatusMsg);
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

  render() {
    const { lang } = this.context;
    const {
      sys: {
        windowPara: { parent, parentPara, edit, editData },
      },
      actions: {
        sys: { setWindow },
      },
    } = this.props;

    let content = null;
    let apply = {
      enable: false,
    };
    const cancel = {
      enable: true,
      text: lang.btn_cancel,
      callback: () => {
        if (parent) setWindow(parent, 0, parentPara || {});
      },
    };

    switch (this.state.tabSelected) {
      case 'syncCloud':
        content = <MountCloud ref="mountCloud" defaultData={editData && editData.type === 'Cloud' ? editData : null} editMode={!!edit} />;
        apply = {
          enable: true,
          text: lang.btn_submit,
          callback: () => {
            const mountCloud = this.refs.mountCloud;
            this.validCheck(mountCloud, 'cloud');
          },
        };
        break;
      case 'syncNas':
        content = <MountNas ref="mountNas" defaultData={editData && editData.type === 'NAS' ? editData : null} editMode={!!edit} />;
        apply = {
          enable: true,
          text: lang.btn_submit,
          callback: () => {
            const mountNas = this.refs.mountNas;
            this.validCheck(mountNas, 'nas');
          },
        };
        break;
      default:
    }

    let tabSelected = 0;
    for (let i = 0; i < this.tabs.length; i++) {
      tabSelected = this.tabs[i].id === this.state.tabSelected ? i : tabSelected;
    }

    return (
      <Window
        type="sync-account"
        title={edit ? lang.window_connection_edit : lang.window_connection_create}
        tabs={this.tabs}
        selected={tabSelected}
        handleTabSelect={this.handleTabSelect}
        setWindow={setWindow}
        apply={apply}
        cancel={cancel}
      >
        {content}
      </Window>
    );
  }
}

export default CreateConnection;
