import React, { PropTypes } from 'react';
import NasFolderTree from './NasFolderTree';
import { setWindow } from '../../../../../actions/sysActions';

export default class NasFiles extends React.Component {

  static contextTypes = {
    lang: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  static propTypes = {
    initializeNasFolderFile: PropTypes.func,
    getNasFolderTree: PropTypes.func,
    getNasFileList: PropTypes.func,
    setNasDir: PropTypes.func,
    currentDir: PropTypes.string,
    nasFolderTree: PropTypes.object,
    nasFileList: PropTypes.array,
    nasSiteList: PropTypes.array,
    isImage: PropTypes.bool,
    isImport: PropTypes.bool,
    setFileSize: PropTypes.func,
    parent: PropTypes.string.isRequired,
    parentPara: PropTypes.object.isRequired,
  };

  constructor(props, context) {
    super(props);
    this.menu = [{ name: context.lang.window_choose_file_select_no_nas || '--No Nas--' }];
    this.menuIndex = 0;
  }

  componentWillMount() {
    const { nasSiteList, isImage, isImport } = this.props;
    if (nasSiteList && nasSiteList.length > 0) {
      this.menu = nasSiteList.map(item => ({ name: item.connName }));
      const paramsFolder = {
        username: nasSiteList[0].connName,
        connectionid: nasSiteList[0].connId,
      };
      const paramsFile = {
        img: (isImage) ? 1 : 0,
        ns: (isImport) ? 1 : 0,
        username: nasSiteList[0].connName,
        connectionid: nasSiteList[0].connId,
      };
      this.props.getNasFolderTree(paramsFolder);
      this.props.getNasFileList(paramsFile);
    }
  }

  componentWillUnmount() {
    this.props.initializeNasFolderFile();
  }

  handleSelect = (e) => {
    const {
      setFileSize,
      initializeNasFolderFile,
      nasSiteList,
      isImage,
      isImport,
      getNasFolderTree,
      getNasFileList,
    } = this.props;
    initializeNasFolderFile();
    this.refs.filePath.value = '';
    if (this.refs.preImg) {
      this.refs.preImg.src = '';
      this.refs.preImg.style.display = 'none';
    }
    if (setFileSize) setFileSize(0);
    this.menuIndex = e.target.value;
    const paramsFolder = {
      username: nasSiteList[this.menuIndex].connName,
      connectionid: nasSiteList[this.menuIndex].connId,
    };
    const paramsFile = {
      img: (isImage) ? 1 : 0,
      ns: (isImport) ? 1 : 0,
      username: nasSiteList[this.menuIndex].connName,
      connectionid: nasSiteList[this.menuIndex].connId,
    };
    getNasFolderTree(paramsFolder);
    getNasFileList(paramsFile);
  };

  handleAddConnection = () => {
    const { parent, parentPara } = this.props;
    this.context.dispatch(setWindow('CreateConnection', 0, { parent, parentPara }));
  };

  renderNasSelect = () => {
    const options = this.menu.map((item, index) => (<option value={index} key={index}>{item.name}</option>));
    return (
      <select onChange={this.handleSelect} ref="select">{options}</select>
    );
  };

  renderFileList = () => {
    const { lang } = this.context;
    const { nasFileList, setFileSize } = this.props;
    const fileList = nasFileList.map((item, index) => {
      let dispalySize = '';
      if (item.size >= 1024) {
        if (item.size / 1024 >= 1024) {
          if (item.size / 1024 / 1024 >= 1024) {
            dispalySize = `${(item.size / 1024 / 1024 / 1024).toFixed(2)} GB`;
          } else {
            dispalySize = `${(item.size / 1024 / 1024).toFixed(2)} MB`;
          }
        } else {
          dispalySize = `${(item.size / 1024).toFixed(2)} KB`;
        }
      } else {
        dispalySize = `${item.size} byte`;
      }
      return (
        <div
          key={`${item.path}-${index}`}
          className='file-row file-item'
          onClick={() => {
            if (this.refs.preImg) {
              this.refs.preImg.src = item.thumbnail_url;
              this.refs.preImg.style.display = 'inline';
            }
            this.refs.filePath.value = item.path;
            if (setFileSize) setFileSize(item.size / 1024 / 1024); // unit: MB
          }}
        >
          <div title={item.file_name} className="file-name">
            {item.file_name}
          </div>
          <div title={dispalySize} className="file-size">
            {dispalySize}
          </div>
          <div title={item.modify_time} className="modify-time">
            {item.modify_time}
          </div>
        </div>
      );
    });
    return (
      <div className="file-wrap" style={(this.props.isImage) ? { height: '55%' } : null}>
        <div className="file-row file-header">
          <div className="file-name">
            {lang.window_choose_file_name || 'File name'}
          </div>
          <div className="file-size">
            {lang.window_choose_file_size || 'File size'}
          </div>
          <div className="modify-time">
            {lang.window_choose_file_modify_time || 'Last modified date'}
          </div>
        </div>
        {fileList}
        {(!this.props.isImage) ? null :
          <div className="preview-image">
            <img src='' ref="preImg" style={{ display: 'none' }}/>
          </div>
        }
      </div>
    );
  }

  render() {
    const { lang } = this.context;
    const { nasSiteList } = this.props;

    let connectionId = null;
    let connectionName = null;
    if (nasSiteList.length > 0 && nasSiteList[this.menuIndex]) {
      connectionId = nasSiteList[this.menuIndex].connId || null;
      connectionName = nasSiteList[this.menuIndex].connName || null;
    }

    return (
      <div>
        <div className="nas-select">
          {lang.window_choose_file_select_title || 'Accessible Nas:'}
          {this.renderNasSelect()}
          <div className="add-new" onClick={this.handleAddConnection}>{lang.general_add}</div>
        </div>
        <div className="nas-wrap">
          <NasFolderTree
            connectionId={connectionId}
            connectionName={connectionName}
            {...this.props}
          />
          {this.renderFileList()}
        </div>
        <div className="path-row">
          <span className="path-title">
            {lang.window_choose_file_path || 'File path:'}
          </span>
          <input type="text" className="path-input" ref="filePath" readOnly />
        </div>
      </div>
    );
  }
}
