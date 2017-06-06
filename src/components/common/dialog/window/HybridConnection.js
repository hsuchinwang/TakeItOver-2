import React, { Component, PropTypes } from 'react';
import Window from '../Window';

class HybridConnection extends Component {

  static contextTypes = {
    lang: PropTypes.object.isRequired,
  };

  static propTypes = {
    actions: PropTypes.shape({
      sys: PropTypes.shape({
        setWindow: PropTypes.func.isRequired,
        setPopup: PropTypes.func.isRequired,
      }),
      user: PropTypes.shape({
        getConnectionList: PropTypes.func.isRequired,
        deleteConnection: PropTypes.func.isRequired,
      }),
    }),
    user: PropTypes.shape({
      connectionList: PropTypes.array.isRequired,
    }),
  };

  componentWillMount() {
    this.props.actions.user.getConnectionList();
  }

  handleClickEdit = (data) => {
    const { type, connectionid } = data;
    this.props.actions.sys.setWindow('CreateConnection', type.toLowerCase() === 'nas' ? 1 : 0, { connId: connectionid, parent: 'HybridConnection', edit: type.toLowerCase() === 'nas' ? 'syncNas' : 'syncCloud', editData: data });
  };

  handleClickDelete = (connId) => {
    this.props.actions.sys.setPopup('CommonPop', {
      typeIcon: 'delete',
      title: this.context.lang.general_delete,
      msg: this.context.lang.popup_connection_delete_msg,
      confirmCallback: () => {
        this.props.actions.user.deleteConnection(connId);
      },
    });
  };

  renderConnectionData = () => {
    const {
      user: { connectionList },
    } = this.props;
    const { lang } = this.context;

    if (connectionList.length > 0) {
      return connectionList.map((item, index) => {
        const status = +item.status === 1 ? <div className="actived">{lang.general_actived}</div> : <div className="failed">{lang.general_failed}</div>;

        return (
          <div className="sheet-row" key={`connection-${index}`}>
            <div className="sheet-cell type">{item.type}</div>
            <div className="sheet-cell target" title={item.connection_name}>{item.connection_name}</div>
            <div className="sheet-cell status">
              <div className="status">{status}</div>
            </div>
            <div className="sheet-cell edit" title={lang.btn_edit}><div className="icon-common-btn_edit_normal" onClick={this.handleClickEdit.bind(this, item)} /></div>
            <div className="sheet-cell delete" title={lang.general_delete}><div className="icon-common-btn_remove_normal" onClick={this.handleClickDelete.bind(this, item.connectionid)} /></div>
          </div>
        );
      });
    }
    return <div className="empty" key="sheet-empty">{lang.general_empty_data}</div>;
  };

  render() {
    const { lang } = this.context;
    const {
      actions: {
        sys: { setWindow },
      },
    } = this.props;
    const apply = { enable: false };
    const cancel = {
      enable: true,
      text: lang.btn_cancel,
    };

    return (
      <Window
        type="hybridConnection"
        title={lang.header_more_hybrid_connection}
        setWindow={setWindow}
        apply={apply}
        cancel={cancel}
      >
        <div className="top-container">
          <div className="btn-add" onClick={setWindow.bind(this, 'CreateConnection', 0, { parent: 'HybridConnection' })}>{lang.general_add}</div>
        </div>
        <div className="list-container">
          <div className="sheet">
            <div className="sheet-row header">
              <div className="sheet-cell type">{lang.share_sheet_type}</div>
              <div className="sheet-cell target">{lang.general_taget}</div>
              <div className="sheet-cell status">{lang.general_status}</div>
              <div className="sheet-cell actions">{lang.general_actions}</div>
            </div>
          </div>
          <div className="sheet">
            {this.renderConnectionData()}
          </div>
        </div>
      </Window>
    );
  }
}

export default HybridConnection;
