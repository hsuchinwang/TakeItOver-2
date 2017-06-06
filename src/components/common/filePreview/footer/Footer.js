import React from 'react';
import FileList from './FileList.js';

export default class Footer extends React.Component {

  static propTypes = {
    fileList: React.PropTypes.array.isRequired,
    fileIndex: React.PropTypes.number.isRequired,
    setFileIndex: React.PropTypes.func.isRequired,
    toggleFileList: React.PropTypes.func.isRequired,
    isFileListShow: React.PropTypes.bool.isRequired,
    isToolbarShow: React.PropTypes.bool.isRequired,
    baseUrl: React.PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);
    this.renderToolbar = this.renderToolbar.bind(this);
    this.renderLeftWrap = this.renderLeftWrap.bind(this);
  }

  renderToolbar() {
    const { fileList, fileIndex, setFileIndex } = this.props;
    const fileName = (fileList[fileIndex]) ? fileList[fileIndex].originName : '';
    return (
      <div className="footer-toolbar">
        <div className="file-name">{fileName}</div>
        <div className="footer-toolbar-btn-wrap">
          {this.renderLeftWrap()}
          <div className="btn-wrap-center">
            {(fileIndex <= 0) ?
              <div className="list-play-btn-end" /> :
              <div
                title={lang_dictionary.file_preview_prev || 'Previous'}
                className="list-play-btn icon-filepreview-play_left"
                onClick={() => {setFileIndex(fileIndex - 1);}}
              />
            }
            <div className="player-play-btn" />
            {(fileIndex >= fileList.length - 1) ?
              <div className="list-play-btn-end" /> :
              <div
                title={lang_dictionary.file_preview_next || 'Next'}
                className="list-play-btn icon-filepreview-play_right"
                onClick={() => {setFileIndex(fileIndex + 1);}}
              />
            }
          </div>
          <div className="btn-wrap-right" />
        </div>
      </div>
    );
  }

  renderLeftWrap() {
    const {
      fileList, fileIndex,
      toggleFileList, isFileListShow
    } = this.props;
    let thumbnailMode = 'icon-filepreview-thumbnail';
    // let thumbnailBulkhead = 'thumbnail-bulkhead';
    // let thumbnailDropdown = 'icon-filepreview-thumbnail_dropdown';
    if (isFileListShow) {
      thumbnailMode += '_active';
      // thumbnailBulkhead += ' active';
      // thumbnailDropdown += '_active';
    }
    return (
      <div className="btn-wrap-left">
        <div className="list-toggle-btn">
          <div
            title={lang_dictionary.file_preview_list || 'File list'}
            className={`thumbnail-btn ${thumbnailMode}`}
            onClick={toggleFileList}
          />
          {/* <div className={thumbnailBulkhead} /> */}
          {/* <div className={`thumbnail-btn ${thumbnailDropdown}`} /> */}
        </div>
        <div className="list-ordinal">
          <div className="list-ordinal-current space-2">{fileIndex + 1}</div>
          <div className="list-ordinal-total space-2">{'\u002F'}</div>
          <div className="list-ordinal-total">{fileList.length}</div>
        </div>
      </div>
    );
  }

  render() {
  	const {
      isFileListShow, isToolbarShow,
      fileList, fileIndex, setFileIndex, baseUrl,
    } = this.props;
    const bottom = (isFileListShow) ? '-156px' : '-86px';
    const style = (isToolbarShow) ? {} : { 'bottom': bottom };
    return (
    	<div
        className="footer-wrap"
        style={style}
      >
    		{(isFileListShow) ?
          <FileList
            fileList={fileList}
            fileIndex={fileIndex}
            setFileIndex={setFileIndex}
            baseUrl={baseUrl}
          />
          : null
        }
    		{this.renderToolbar()}
    	</div>
    );
  }
}
