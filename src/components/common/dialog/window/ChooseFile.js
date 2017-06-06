import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Window from '../Window';
import NasFiles from './nasFileList/NasFiles';
import Dropzone from 'react-dropzone';

export default class ChooseFile extends Component {

  static contextTypes = {
    lang: PropTypes.object.isRequired,
  };

  static propTypes = {
    actions: PropTypes.object.isRequired,
    sys: PropTypes.object.isRequired,
    nas: PropTypes.object.isRequired,
  };

  constructor(props, context) {
    super(props);
    const { lang } = context;
    this.tabs = [
      {
        title: lang.window_choose_file_pc_tab || 'Current computer upload',
        id: 'location-0',
      },
      {
        title: lang.window_choose_file_nas_tab || 'NAS - Share folder',
        id: 'location-1',
      },
    ];
    this.state = { fileSize: 0 };
    this.cancel = { enable: false, text: lang.btn_cancel };
  }

  componentWillMount() {
    this.props.actions.nas.getNasSite();
  }

  componentWillUpdate(nextProps) {
    if (this.state.fileSize !== 0 && this.props.sys.tabSelected !== nextProps.sys.tabSelected) {
      this.setState({ fileSize: 0 });
    }
  }

  getDescription = () => {
    const { maximumSize } = this.props.sys.windowPara;
    const {
      lang: { editor: { uploadFileExceedsSize, uploadFileHint } },
    } = this.context;
    if (this.state.fileSize > maximumSize) {
      return (uploadFileExceedsSize && uploadFileExceedsSize.replace('$1', maximumSize)) || `The file must be under ${maximumSize} in size`;
    }
    return (uploadFileHint && uploadFileHint.replace('$1', maximumSize)) || `The maximum file size is ${maximumSize}MB`;
  };

  selectedFile(files) {
    if (!files.length) return;
    const dom = ReactDOM.findDOMNode(this.refs.dropzone);
    dom.className = 'dropzone';
    this.props.sys.windowPara.callback([files[0]]);
    this.props.actions.sys.setWindow(null, 0, null);
  }

  dragEnter() {
    const dom = ReactDOM.findDOMNode(this.refs.dropzone);
    dom.className = 'dropzone dropzone-active';
  }

  dragLeave() {
    const dom = ReactDOM.findDOMNode(this.refs.dropzone);
    dom.className = 'dropzone';
  }

  renderLocalUpload() {
    const { lang } = this.context;
    const { fileSize } = this.state;
    const { maximumSize, allowType } = this.props.sys.windowPara;

    return (
      <div>
        <Dropzone ref="dropzone"
          className="dropzone"
          onDragEnter={this.dragEnter.bind(this)}
          onDragLeave={this.dragLeave.bind(this)}
          onDrop={this.selectedFile.bind(this)}
          accept={allowType || undefined}
          maxSize={maximumSize * 1024 * 1024}
        >
          <p>{ lang.editor.dragFile }</p>
          <p>{ lang.general_or }</p>
          <button>{ lang.editor.chooseFile }</button>
        </Dropzone>
        <div
          className="description"
          style={{ color: (fileSize > maximumSize) ? '#c1272d' : '' }}
        >
          {this.getDescription()}
        </div>
      </div>
    );
  }

  renderNasUpload(isImage) {
    const { fileSize } = this.state;
    const {
      windowPara: { maximumSize },
      windowPara,
    } = this.props.sys;
    const { getNasFolderTree, getNasFileList, setNasDir, initializeNasFolderFile } = this.props.actions.nas;
    const { nasFolderTree, nasFileList, currentDir, nasSiteList } = this.props.nas;

    return (
      <div>
        <NasFiles ref="nasFiles"
          initializeNasFolderFile={initializeNasFolderFile}
          getNasFolderTree={getNasFolderTree}
          getNasFileList={getNasFileList}
          setNasDir={setNasDir}
          nasFolderTree={nasFolderTree}
          nasFileList={nasFileList}
          currentDir={currentDir}
          nasSiteList={nasSiteList}
          isImage={isImage}
          setFileSize={(newSize) => { this.setState({ fileSize: newSize }); }}
          parent="ChooseFile"
          parentPara={windowPara}
        />
        <div
          className="description"
          style={{ color: (fileSize > maximumSize) ? '#c1272d' : '' }}
        >
          {this.getDescription()}
        </div>
      </div>
    );
  }

  render() {
    const { lang } = this.context;
    const {
      sys: {
        windowPara: { commandName },
        tabSelected,
      },
      nas: { nasSiteList },
      note: { noteInfo: { connId } },
    } = this.props;
    const isImage = !!(commandName.match(/[i|I]mage/));
    const { file, fileSize } = this.state;
    const { maximumSize } = this.props.sys.windowPara;
    const isSizeLegal = (fileSize > 0 && fileSize <= maximumSize);

    const windowTitle = isImage ? (lang.window_choose_file_title_img || 'Choose image')
      : (lang.window_choose_file_title || 'Choose file');

    let apply = {
      enable: isSizeLegal,
      text: lang.btn_submit,
      callback: () => {
        this.props.sys.windowPara.callback([file]);
        this.props.actions.sys.setWindow(null, 0, null);
      },
    };
    const cancel = { enable: true, text: lang.btn_cancel };

    if (tabSelected) {
      apply = {
        enable: isSizeLegal,
        text: lang.btn_submit,
        callback: () => {
          const nasPath = this.refs.nasFiles.refs.filePath.value;
          const index = this.refs.nasFiles.menuIndex;
          let params = { local: true, nasPath };
          if (nasSiteList[index] && !nasSiteList[index].local && nasSiteList[index].connId !== connId) {
            params = {
              local: false,
              remoteNasPath: nasPath,
              username: nasSiteList[index].connName,
              connectionid: nasSiteList[index].connId,
            };
          }
          this.props.sys.windowPara.callback([null, params]);
          this.props.actions.sys.setWindow(null, 0, null);
        },
      };
    }

    return (
      <Window
        type="choose-file"
        title={windowTitle}
        tabs={this.tabs}
        selected={this.props.sys.tabSelected}
        setTabSelected={this.props.actions.sys.setTabSelected}
        setWindow={this.props.actions.sys.setWindow}
        apply={apply}
        cancel={cancel}
      >
        { tabSelected ? this.renderNasUpload(isImage) : this.renderLocalUpload(isImage) }
      </Window>
    );
  }
}
