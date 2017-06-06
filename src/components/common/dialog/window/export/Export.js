import React, { Component, PropTypes } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import classnames from 'classnames';
import Window from '../../Window';
import ExportToNas from './ExportToNas';

export default class ExportSecondStep extends Component {

  static contextTypes = {
    lang: PropTypes.object.isRequired,
  }

  static propTypes = {
    actions: PropTypes.shape({
      sys: PropTypes.shape({
        setWindow: PropTypes.func.isRequired,
        setGAEvent: PropTypes.func.isRequired,
        setTabSelected: PropTypes.func.isRequired,
      }).isRequired,
      export: PropTypes.shape({
        exportByDownload: PropTypes.func.isRequired,
      }).isRequired,
      nas: PropTypes.shape({
        initializeNasFolderFile: PropTypes.func.isRequired,
        getNasFolderTree: PropTypes.func.isRequired,
        getNasFileList: PropTypes.func.isRequired,
        setNasDir: PropTypes.func.isRequired,
      }).isRequired,
    }),
    sys: PropTypes.shape({
      windowPara: PropTypes.shape({
        fileList: PropTypes.string,
        type: PropTypes.string,
      }).isRequired,
      tabSelected: PropTypes.number.isRequired,
    }),
    nas: PropTypes.shape({
      nasFolderTree: PropTypes.object.isRequired,
      currentDir: PropTypes.string.isRequired,
    }),
  };

  constructor(props, context) {
    super(props);
    const { type } = props.sys.windowPara;
    const { lang } = context;
    this.tabs = [
      {
        title: lang.window_exportSecondStep_download_tab || 'Download',
        id: 'exportLoc-0',
      },
      {
        title: lang.window_exportSecondStep_nas_tab || 'Export to NAS',
        id: 'exportLoc-1',
      },
    ];
    this.state = {
      isSelected: type === 'pdf' ? 'pdf' : 'ns3',
      nasParams: {
        path: '/Public',
      },
      isNasDialogToggle: false,
      applyEnable: false,
    };
  }

  componentWillMount() {
    this.props.actions.nas.getNasSite();
  }

  handleRadioChanged = (id) => {
    this.setState({ isSelected: id });
  };

  handleConfirm = () => {
    const passProp = {
      file_type: this.state.isSelected,
      file_name: this.refs.name.value,
    };
    const { fileList } = this.props.sys.windowPara;
    if (fileList) {
      passProp.file_list = fileList;
    }
    if (this.props.sys.tabSelected === 1 /* export to nas */) {
      const { nasParams } = this.state;
      if (nasParams.local) passProp.nasPath = nasParams.path;
      else {
        passProp.remoteList = {
          remoteNasPath: nasParams.path,
          username: nasParams.username,
          connectionid: nasParams.connectionid,
        };
      }
    }
    this.props.actions.export.exportByDownload(passProp, () => {
      this.props.actions.sys.setWindow(null);
    });
    this.props.actions.sys.setGAEvent('MainMenu', 'Export');
  };

  renderRadioButtons = radioButtons => {
    const { isSelected } = this.state;
    return radioButtons.map((item, index) => (
      <div key={`export-radio-${index}`} className="custom-radio" onClick={this.handleRadioChanged.bind(this, item.id)}>
        <div className={classnames('qnote-input-radio', { active: isSelected === item.id })} />
        <div>{item.title}</div>
      </div>
    ));
  };

  renderBaseContent = () => {
    const { lang } = this.context;
    const { type } = this.props.sys.windowPara;
    const radioButtons = [];
    switch (type) {
      case 'pdf':
        radioButtons.push({ id: 'pdf', title: 'pdf' });
        break;
      case 'ns3':
      default:
        radioButtons.push({ id: 'ns3', title: 'ns3' });
        break;
    }

    const content = [
      <div className="form-cell" key="exportRow-1">
        <div>{lang.window_exportSecondStep_fileFormat}</div>
        <div className="radioPanel">{this.renderRadioButtons(radioButtons)}</div>
      </div>,
      <div className="form-cell" key="exportRow-2">
        <label htmlFor="name">{lang.window_exportSecondStep_fileName}</label>
        <input
          id="name"
          ref="name"
          type="text"
          defaultValue={`NotesStation_Export_${new Date().toLocaleDateString()}`}
        />
      </div>,
    ];

    return content;
  };

  renderNasContent = (baseContent) => {
    baseContent.push(
      <div className="form-cell" key="exportRow-3">
        <div>{this.context.lang.window_exportSecondStep_nas_path || 'Folder path:'}</div>
        <input id="nasPath" ref="nasPath" type="text" value={this.state.nasParams.path} readOnly />
        <button
          className="chooseNasPath"
          onClick={() => { this.setState({ isNasDialogToggle: true }); }}
        >
          {"..."}
        </button>
        <span style={{ flex: '0' }}>
          <ReactCSSTransitionGroup transitionEnterTimeout={200} transitionLeaveTimeout={250} transitionName="showHide">
            {(this.state.isNasDialogToggle) ?
              <ExportToNas
                initializeNasFolderFile={this.props.actions.nas.initializeNasFolderFile}
                nasFolderTree={this.props.nas.nasFolderTree}
                nasSiteList={this.props.nas.nasSiteList}
                currentDir={this.props.nas.currentDir}
                getNasFolderTree={this.props.actions.nas.getNasFolderTree}
                getNasFileList={this.props.actions.nas.getNasFileList}
                setNasDir={this.props.actions.nas.setNasDir}
                closeDialog={(params = { path: '/Public' }, applyEnable = false) => {
                  this.setState({
                    isNasDialogToggle: false,
                    nasParams: params,
                    applyEnable,
                  });
                }}
                parent="ExportSecondStep"
                parentPara={this.props.sys.windowPara}
              />
              : null
            }
          </ReactCSSTransitionGroup>
        </span>
      </div>
    );
    return baseContent;
  };

  render() {
    const { lang } = this.context;
    const {
      sys: { tabSelected },
    } = this.props;
    let content = this.renderBaseContent();
    if (this.props.sys.tabSelected === 1 /* export to nas */) {
      content = this.renderNasContent(content);
    }
    return (
      <Window
        type="exportSecondStep"
        tabs={this.tabs}
        selected={this.props.sys.tabSelected}
        setTabSelected={this.props.actions.sys.setTabSelected}
        title={lang.window_export_title}
        setWindow={this.props.actions.sys.setWindow}
        apply={{
          enable: true,
          disable: (tabSelected === 1 && !this.state.applyEnable),
          text: lang.btn_confirm,
          callback: this.handleConfirm,
        }}
        cancel={{
          enable: true,
          text: lang.btn_cancel,
        }}
      >
        <div className="form">
          <div className="form-column">{content}</div>
        </div>
      </Window>
    );
  }
}
