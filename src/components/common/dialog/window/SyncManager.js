import React, { Component, PropTypes } from 'react';
import Window from '../Window';
import DropDownMenu from '../../dropdown/DropDownMenu';
import { setSyncAll } from '../../../../apis/user';

class SyncManager extends Component {

  static contextTypes = {
    lang: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
  };

  static propTypes = {
    actions: PropTypes.shape({
      user: PropTypes.shape({
        getSyncList: PropTypes.func.isRequired,
        setSyncPolicy: PropTypes.func.isRequired,
        deleteSync: PropTypes.func.isRequired,
      }),
      sys: PropTypes.shape({
        setWindow: PropTypes.func.isRequired,
        setPopup: PropTypes.func.isRequired,
      }),
      note: PropTypes.shape({
        setSelectedTreeItem: PropTypes.func.isRequired,
      }),
    }),
    user: PropTypes.shape({
      isSync: PropTypes.bool.isRequired,
      syncList: PropTypes.array.isRequired,
      syncPolicy: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    }),
  };

  constructor(props) {
    super(props);
    this.state = {
      policy: 0,
      time: 0,
    };
  }

  componentWillMount() {
    this.props.actions.user.getSyncList();
  }

  handleClickEdit = (data) => {
    const { setting_id: settingId, nb_id: nbId, status } = data;
    const { isSync } = this.props.user;

    if (isSync && +status === 0) return;
    this.props.actions.sys.setWindow('SetSync', 0, { connId: 'local', nbId, edit: true, settingId, sync: 1 });
  };

  handleClickDelete = (data) => {
    const { setting_id: settingId, nb_id: nbId, status } = data;
    const { isSync } = this.props.user;

    if (isSync && +status === 0) return;
    this.props.actions.sys.setPopup('CommonPop', {
      typeIcon: 'delete',
      title: this.context.lang.general_delete,
      msg: this.context.lang.popup_sync_delete_msg,
      confirmCallback: () => {
        this.props.actions.user.deleteSync(settingId, nbId);
      },
    });
  };

  handleClickStatus = (nbId) => {
    this.props.actions.sys.setWindow('SyncStatus', 0, { nbId });
  };

  handleChangePolicy = (policy) => {
    this.setState({ policy });
  };

  handleChangeSyncTime = (index, time) => {
    this.setState({ time });
  };

  handleClickSync = () => {
    const { isSync } = this.props.user;

    if (!isSync) setSyncAll();
  };

  handleClickLinktoNotebook = (nbId) => {
    const {
      actions: {
        sys: { setWindow },
        note: { setSelectedTreeItem },
      },
    } = this.props;

    this.context.router.push('/notebook');
    setSelectedTreeItem({
      connId: 'local',
      id: nbId,
      type: 'notebook',
    });
    setWindow(null);
  };

  renderSyncListData = () => {
    const {
      user: { isSync, syncList },
    } = this.props;
    const { lang } = this.context;

    if (syncList.length > 0) {
      return syncList.map((item, index) => {
        let status = +item.status === 1 ? <div className="failed">{lang.general_failed}</div> : <div className="standby">{lang.general_standby}</div>;
        if (isSync) status = <div className="syncing">{lang.general_syncing}</div>;

        return (
          <div className="sheet-row" key={`sync-${index}`}>
            <div className="sheet-cell name link" title={lang.window_sync_manager_go_to_notebook} onClick={this.handleClickLinktoNotebook.bind(this, item.nb_id)}>{item.nb_name}</div>
            <div className="sheet-cell target" title={item.connection_name}>{item.connection_name}</div>
            <div className="sheet-cell status" title={lang.window_sync_manager_display_status_log}>
              <div className="status" onClick={this.handleClickStatus.bind(this, item.nb_id)}>{status}</div>
            </div>
            <div className="sheet-cell edit" title={lang.btn_edit}><div className={isSync && +item.status === 0 ? 'btn_edit_normal_disable' : 'icon-common-btn_edit_normal'} onClick={this.handleClickEdit.bind(this, item)} /></div>
            <div className="sheet-cell delete" title={lang.general_delete}><div className={isSync && +item.status === 0 ? 'btn_remove_normal_disable' : 'icon-common-btn_remove_normal'} onClick={this.handleClickDelete.bind(this, item)} /></div>
          </div>
        );
      });
    }
    return <div className="empty" key="sheet-empty">{lang.general_empty_data}</div>;
  };

  render() {
    const { lang } = this.context;
    const {
      user: { syncPolicy, syncTime },
      actions: {
        sys: { setWindow },
        user: { setSyncPolicy },
      },
    } = this.props;
    const setTime = !syncTime || syncTime == false ? 0 : syncTime;
    const apply = {
      enable: true,
      text: lang.btn_confirm,
      callback: () => {
        if (this.state.policy !== +syncPolicy || this.state.time !== setTime) setSyncPolicy(this.state.policy, this.state.time);
        setWindow(null);
      },
    };
    const cancel = {
      enable: true,
      text: lang.btn_cancel,
    };
    const policy = [
      {
        name: lang.window_sync_policy_keep_news,
      },
      {
        name: lang.window_sync_policy_nas_first,
      },
      {
        name: lang.window_sync_policy_cloud_first,
      },
    ];
    const syncTimeOpts = [
      {
        name: lang.manual_sync,
        value: 0,
      },
      {
        name: `30 ${lang.general_minute}`,
        value: 30,
      },
      {
        name: `1 ${lang.general_hour}`,
        value: 60,
      },
      {
        name: `2 ${lang.general_hour}`,
        value: 120,
      },
      {
        name: `6 ${lang.general_hour}`,
        value: 360,
      },
      {
        name: `12 ${lang.general_hour}`,
        value: 720,
      },
      {
        name: `24 ${lang.general_hour}`,
        value: 1440,
      },
    ];

    return (
      <Window
        type="syncManager"
        title={lang.window_sync_manager_title}
        setWindow={setWindow}
        apply={apply}
        cancel={cancel}
      >
        <div className="top-container">
          <div className="btn-sync" onClick={this.handleClickSync}>{lang.general_sync_all}</div>
        </div>
        <div className="list-container">
          <div className="sheet">
            <div className="sheet-row header">
              <div className="sheet-cell name">{lang.general_notebook}</div>
              <div className="sheet-cell target">{lang.window_sync_manager_header_targe}</div>
              <div className="sheet-cell status">{lang.general_status}</div>
              <div className="sheet-cell actions">{lang.general_actions}</div>
            </div>
          </div>
          <div className="sheet">
            {this.renderSyncListData()}
          </div>
        </div>
        <div className="bottom-container">
          <div className="policy">{lang.window_sync_policy}</div>
          <DropDownMenu menus={policy} selected={+syncPolicy} onchange={this.handleChangePolicy} normal />
          <div className="sync-time">
            <div className="policy" style={{ marginLeft: '30px' }}>{lang.sync_time}</div>
            <DropDownMenu menus={syncTimeOpts} selected={+setTime} onchange={this.handleChangeSyncTime} normal />
          </div>
        </div>
      </Window>
    );
  }
}

export default SyncManager;
