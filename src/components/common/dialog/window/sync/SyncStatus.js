import React, { Component, PropTypes } from 'react';
import Window from '../../Window';

class SyncStatus extends Component {

  static contextTypes = {
    lang: PropTypes.object.isRequired,
  };

  static propTypes = {
    actions: PropTypes.shape({
      user: PropTypes.shape({
        getSyncList: PropTypes.func.isRequired,
        getSyncLog: PropTypes.func.isRequired,
      }),
      sys: PropTypes.shape({
        setWindow: PropTypes.func.isRequired,
      }),
    }),
    user: PropTypes.shape({
      syncLogs: PropTypes.array.isRequired,
    }),
    sys: PropTypes.shape({
      windowPara: PropTypes.shape({
        nbId: PropTypes.string.isRequired,
      }),
    }),
  };

  componentWillMount() {
    this.props.actions.user.getSyncLog(this.props.sys.windowPara.nbId);
  }

  renderSyncLogs = () => {
    const { user: { syncLogs } } = this.props;
    const { lang } = this.context;

    if (syncLogs.length > 0) {
      return syncLogs.map((item, index) => {
        return (
          <div className="sheet-row" key={`sync-status-${index}`}>
            <div className="sheet-cell time">{item.update_time}</div>
            <div className="sheet-cell info">{+item.status === 1 ? lang.general_failed : lang.general_success}</div>
          </div>
        );
      });
    }
    return <div className="empty" key="sheet-empty">{lang.general_empty_data}</div>;
  };

  render() {
    const { lang } = this.context;

    return (
      <Window
        type="syncStatus"
        title={this.context.lang.window_sync_status_title}
        setWindow={this.props.actions.sys.setWindow}
        apply={{ enable: false }}
        cancel={{
          enable: false,
          callback: () => {
            this.props.actions.sys.setWindow('SyncManager');
          },
        }}
      >
        <div className="sheet">
          <div className="sheet-row header">
            <div className="sheet-cell time">{lang.general_start_time}</div>
            <div className="sheet-cell info">{lang.general_information}</div>
          </div>
        </div>
        <div className="sheet">
          {this.renderSyncLogs()}
        </div>
      </Window>
    );
  }
}

export default SyncStatus;
