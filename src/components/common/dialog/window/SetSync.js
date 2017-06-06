import React, { PropTypes } from 'react';
import Window from '../Window';
import DropDownMenu from '../../dropdown/DropDownMenu';

export default class SetSync extends React.Component {
  static contextTypes = {
    lang: PropTypes.object.isRequired,
  };

  static propTypes = {
    actions: PropTypes.shape({
      sys: PropTypes.shape({
        setWindow: PropTypes.func.isRequired,
        setWindowErrorMessage: PropTypes.func.isRequired,
        setTabSelected: PropTypes.func.isRequired,
      }),
      user: PropTypes.shape({
        getSyncSite: PropTypes.func.isRequired,
        getSyncNotebook: PropTypes.func.isRequired,
        setSync: PropTypes.func.isRequired,
        clearSyncNotebook: PropTypes.func.isRequired,
      }),
      note: PropTypes.shape({
        clearSyncInfo: PropTypes.func.isRequired,
      }),
    }),
    note: PropTypes.shape({
      syncInfo: PropTypes.object.isRequired,
    }),
    sys: PropTypes.shape({
      windowType: PropTypes.string.isRequired,
      windowPara: PropTypes.object.isRequired,
      errorMessage: PropTypes.object,
      tabSelected: PropTypes.number,
    }),
    user: PropTypes.shape({
      syncSiteList: PropTypes.array.isRequired,
      syncNbList: PropTypes.array.isRequired,
      tabSelected: PropTypes.number,
    }),
  };

  componentWillMount() {
    const {
      sys: {
        windowPara: { sync, edit, connId, nbId },
      },
      actions: {
        user: { getSyncSite },
        note: { getSyncInfo },
      },
    } = this.props;

    if (sync === 1) getSyncInfo(connId, nbId);
    if (sync === 1 && !edit) return;
    getSyncSite();
  }

  componentWillUnmount() {
    this.props.actions.user.clearSyncNotebook(true);
    this.props.actions.note.clearSyncInfo();
  }

  handleSiteSelect = (index, value) => {
    if (value !== -1) {
      const syncSite = this.props.user.syncSiteList[value];
      this.props.actions.user.getSyncNotebook(syncSite.conntId);
    } else if (value === -1) {
      this.props.actions.user.clearSyncNotebook();
    }
  };

  handleApply = () => {
    const { lang } = this.context;
    const {
      actions: {
        sys: { setWindowErrorMessage },
        user: { setSync, updateSync },
      },
      sys: {
        windowPara: { edit, nbId, settingId },
      },
    } = this.props;
    const siteKey = this.refs.siteSelect.getSelected();

    if (siteKey !== -1) {
      const notebookId = this.refs.nbSelect.getSelected();
      const syncSite = this.props.user.syncSiteList[siteKey];
      const params = {
        nb_id: nbId,
        target_site: syncSite.conntId,
        target_userid: syncSite.userId,
        target_nb_id: notebookId,
      };

      if (edit) {
        params.setting_id = settingId;
        updateSync(params, setWindowErrorMessage);
      } else setSync(params, setWindowErrorMessage);
    } else {
      setWindowErrorMessage(lang.window_set_sync_select_none_err);
    }
  };

  renderSiteSelect = () => {
    const { lang } = this.context;
    const {
      note: {
        syncInfo: { connectionName, targetSite },
      },
      user: { syncSiteList },
      sys: {
        windowPara: { sync, edit },
      },
    } = this.props;
    let selectedInd = 0;

    let options = syncSiteList.map((item, index) => {
      if (targetSite && item.conntId === targetSite) selectedInd = index + 1;
      return {
        name: item.siteName,
        value: index,
      };
    });
    options.unshift({ name: lang.window_set_sync_select_site_option, value: -1 });

    if (options.length === 1) options = [{ name: lang.window_set_sync_add_site_option, value: -1 }];
    if (sync === 1 && !edit && connectionName) options = [{ name: connectionName }];
    return <DropDownMenu ref="siteSelect" menus={options} onchange={this.handleSiteSelect} normal disabled={(sync === 1 && !edit)} selected={selectedInd} />;
  };

  renderNbSelect = () => {
    const { lang } = this.context;
    const {
      note: {
        syncInfo: { nbName, nbId },
      },
      user: { syncNbList },
      sys: {
        windowPara: { sync, edit },
      },
    } = this.props;
    let selectedInd = 0;

    let options = [];
    syncNbList.forEach((item, index) => {
      if (nbId && item.id === nbId) selectedInd = index;
      if (sync !== 1 && item.sync === 1) return;
      options.push({
        name: item.name,
        value: item.id,
      });
    });

    if (options.length === 0) options = [{ name: lang.window_set_sync_no_notebook_option, value: 'noNB' }];
    if (sync === 1 && !edit && nbName) options = [{ name: nbName }];
    return <DropDownMenu ref="nbSelect" menus={options} normal disabled={(sync === 1 && !edit)} selected={selectedInd} />;
  };

  renderContent = () => {
    const { lang } = this.context;
    const {
      actions: {
        sys: { setWindow },
      },
      sys: {
        windowPara,
        windowPara: { sync, edit },
      },
    } = this.props;

    return (
      <div>
        <div className="text">{lang.window_set_sync_select_site_and_notebook}</div>
        <div className="site-box">
          {this.renderSiteSelect()}
          {
            (sync === 1 && !edit) ? null : <div className="add-new" onClick={setWindow.bind(this, 'CreateConnection', 0, { parent: 'SetSync', parentPara: windowPara })}>{lang.general_add}</div>
          }
        </div>
        <div>
          {this.renderNbSelect()}
        </div>
        {
          (sync === 1 && !edit) ? <div className="warn"><div>{lang.window_set_sync_syncing}, </div><div className="detail" onClick={setWindow.bind(this, 'SyncManager', 0, {})}>{lang.window_set_sync_sync_manager_link}</div></div> : <div className="warn">{lang.window_set_sync_warn}</div>
        }
      </div>
    );
  };

  render() {
    const { lang } = this.context;
    const {
      actions: {
        sys: { setWindow },
      },
      sys: {
        errorMessage,
        windowPara: { sync, edit },
      },
    } = this.props;

    return (
      <Window
        type="set-sync"
        title={edit ? lang.window_sync_update_title : lang.window_set_sync}
        setWindow={setWindow}
        errorMessage={errorMessage}
        apply={{
          enable: !(sync === 1 && !edit),
          text: lang.btn_apply,
          callback: this.handleApply,
        }}
        cancel={{
          enable: true,
          text: lang.btn_cancel,
          callback: () => {
            if (edit) setWindow('SyncManager');
          },
        }}
      >
        {this.renderContent()}
      </Window>
    );
  }
}
