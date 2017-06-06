import React, { PropTypes } from 'react';
import NasFolderTree from '../nasFileList/NasFolderTree';
import { setWindow } from '../../../../../actions/sysActions';

export default class ExportToNas extends React.Component {

  static contextTypes = {
    lang: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  static propTypes = {
    getNasFolderTree: PropTypes.func.isRequired,
    getNasFileList: PropTypes.func.isRequired,
    setNasDir: PropTypes.func.isRequired,
    nasFolderTree: PropTypes.object,
    currentDir: PropTypes.string,
    initializeNasFolderFile: PropTypes.func.isRequired,
    parent: PropTypes.string.isRequired,
    parentPara: PropTypes.object.isRequired,
  };

  constructor(props, context) {
    super(props);
    this.menu = [{ name: context.lang.window_choose_file_select_no_nas || '--No Nas--' }];
    this.menuIndex = 0;
    this.state = {
      applyEnable: false,
    };
  }

  componentWillMount() {
    const { nasSiteList } = this.props;
    if (nasSiteList && nasSiteList.length > 0) {
      this.menu = nasSiteList.map((item) => ({ name: item.connName }));
      const paramsFolder = {
        username: nasSiteList[0].connName,
        connectionid: nasSiteList[0].connId,
        export: true,
      };
      this.props.getNasFolderTree(paramsFolder);
    }
  }

  shouldComponentUpdate(nextProps) {
    if (this.props.currentDir !== nextProps.currentDir) {
      this.state.applyEnable = true;
    } else if (!nextProps.currentDir && this.state.applyEnable) {
      this.state.applyEnable = false;
    }
    return true;
  }

  componentWillUnmount() {
    this.props.initializeNasFolderFile();
  }

  renderNasSelect = () => {
    const options = this.menu.map((item, index) => <option value={index} key={index}>{item.name}</option>);

    return <select onChange={this.handleSelect} ref="select">{options}</select>;
  };

  renderButtons = (apply, cancel) => {
    if ((apply && apply.enable) || (cancel && cancel.enable)) {
      return (
        <div className="buttons">
          { apply.enable ? <div className={ apply.disable ? 'btn-disable _nas_export' : 'btn-submit _nas_export'}>{ apply.text }</div> : null }
          { cancel.enable ? <div className="btn-cancel _nas_export">{ cancel.text }</div> : null }
        </div>
      );
    }
    return null;
  };

  handleSelect = (e) => {
    this.props.initializeNasFolderFile();
    this.refs.filePath.value = '';
    const { nasSiteList } = this.props;
    this.menuIndex = e.target.value;
    const paramsFolder = {
      username: nasSiteList[this.menuIndex].connName,
      connectionid: nasSiteList[this.menuIndex].connId,
      export: true,
    };
    this.props.getNasFolderTree(paramsFolder);
  }

  handleClick = (e) => {
    switch (e.target.className) {
      case 'btn-submit _nas_export': {
        const { nasSiteList } = this.props;
        const nasPath = this.refs.filePath.value;
        const index = this.menuIndex;
        let params = {
          local: true,
          path: nasPath,
        };
        if (nasSiteList[index] && !nasSiteList[index].local) {
          params = {
            local: false,
            path: nasPath,
            username: nasSiteList[index].connName,
            connectionid: nasSiteList[index].connId,
          };
        }
        this.props.closeDialog(params, true);
        break;
      }
      case 'close _nas_export':
      case 'btn-cancel _nas_export':
        this.props.closeDialog();
        break;
      default:
    }
  };

  handleAddConnection = () => {
    const { parent, parentPara } = this.props;
    this.context.dispatch(setWindow('CreateConnection', 0, { parent, parentPara }));
  };

  render() {
    const { lang } = this.context;
    const apply = {
      enable: true,
      disable: !this.state.applyEnable,
      text: lang.btn_apply,
    };
    const cancel = {
      enable: true,
      text: lang.btn_cancel,
    };
    const { nasSiteList } = this.props;
    let connectionId = null;
    let connectionName = null;

    if (nasSiteList.length > 0 && nasSiteList[this.menuIndex]) {
      connectionId = nasSiteList[this.menuIndex].connId || null;
      connectionName = nasSiteList[this.menuIndex].connName || null;
    }
    return (
      <div className="qnote-mask" style={{ position: 'fixed', zIndex: 9 }}>
        <div className={"window-ExportToNas"} onClick={this.handleClick}>
          <div className="close _nas_export" />
          <div className="header">
            <div className="title-wrapper">
              <div className="title">
                {lang.window_exportSecondStep_nas_title || 'Choose folder from NAS'}
              </div>
            </div>
            <div className="hr" />
          </div>
          <div className="container">
            <div className="nas-select">
              {lang.window_choose_file_select_title || 'Accessible Nas:'}
              {this.renderNasSelect()}
              <div className="add-new" onClick={this.handleAddConnection}>{lang.general_add}</div>
            </div>
            <div className="nas-wrap">
              <NasFolderTree
                isExport
                connectionId={connectionId}
                connectionName={connectionName}
                {...this.props}
              />
            </div>
            <div className="path-row">
              <span className="path-title">
                {lang.window_exportSecondStep_nas_path || 'Folder path:'}
              </span>
              <input type="text"
                ref="filePath"
                readOnly
                className="path-input"
                value={(this.props.currentDir === '') ? '/Public' : this.props.currentDir} />
            </div>
          </div>
          <div className="footer">
            { this.renderButtons(apply, cancel) }
          </div>
        </div>
      </div>
    );
  }
}
