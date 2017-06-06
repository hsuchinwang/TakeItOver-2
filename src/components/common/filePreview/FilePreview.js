import React, { PropTypes } from 'react';
import Header from './header/Header.js';
import Footer from './footer/Footer.js';
import SizeCtrlPanel from './header/sizeCtrlPanel/SizeCtrlPanel.js';
import ImgViewer from './fileViewer/ImgViewer.js';
import { connIdNormaliz, getBaseUrl } from '../../../common/Utils';

export default class FilePreview extends React.Component {

  static propTypes = {
    note: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.renderFileViewer = this.renderFileViewer.bind(this);
  }

  componentDidMount() {
    window.onresize = () => {
      this.props.actions.filePreview.setIsWindowResized(true);
    };
  }

  componentWillUnmount() {
    window.onresize = null;
    this.props.actions.filePreview.initializeFilePreview();
  }

  getFileUrlPrefix(tokenId = null) {
    const {
      note: { noteInfo: { connId } },
      user: { siteList },
    } = this.props;
    const id = tokenId || connId;
    const baseUrl = getBaseUrl(id, siteList);
    const connectId = connIdNormaliz(connId);
    return `${baseUrl}/ns/api/v2/note/${connectId}`;
  }

  renderFileViewer() {
    const {
      imgOriginSize, imgSize, imgScale, imgOffset,
      fileList, fileIndex, isWindowResized,
    } = this.props.filePreview;
    const {
      setImgOriginSize, setImgSize, setImgScale, setImgOffset,
      toggleToolbar, setIsResizable, setIsWindowResized, setIsToolbarShow,
    } = this.props.actions.filePreview;
    const fileType = (fileList[fileIndex]) ? fileList[fileIndex].ext : '';
    switch (fileType) {
      case 'jpg':
      case 'png':
      case 'gif': {
        const path = (fileList[fileIndex]) ? fileList[fileIndex].src : '';
        const fileId = (fileList[fileIndex]) ? fileList[fileIndex].fileId : null;
        return (
          <ImgViewer
            fileList={fileList}
            fileIndex={fileIndex}
            fileId={fileId}
            path={path}
            setIsToolbarShow={setIsToolbarShow}
            imgOriginSize={imgOriginSize} imgSize={imgSize}
            imgScale={imgScale} imgOffset={imgOffset}
            setIsResizable={setIsResizable}
            setImgOriginSize={setImgOriginSize}
            setImgSize={setImgSize} setImgScale={setImgScale}
            setImgOffset={setImgOffset}
            setIsWindowResized={setIsWindowResized}
            toggleToolbar={toggleToolbar}
            isWindowResized={isWindowResized}
            baseUrl={this.getFileUrlPrefix('local')}
          />
        );
      }
      case 'mp4':
      case 'm4a':
      case 'mp3':
        return (
          <div className="light-box-wrap">
            <div className="file-icon icon-filepreview-filetype-ic_audio_2x" />
            <div className="light-box-background" onClick={toggleToolbar} />
          </div>
        );
      case 'pdf':
        return (
          <div className="light-box-wrap">
            <div className="file-icon icon-filepreview-filetype-ic_pdf_2x" />
            <div className="light-box-background" onClick={toggleToolbar} />
          </div>
        );
      case 'doc':
      case 'docx':
        return (
          <div className="light-box-wrap">
            <div className="file-icon icon-filepreview-filetype-ic_word_2x" />
            <div className="light-box-background" onClick={toggleToolbar} />
          </div>
        );
      case 'xls':
      case 'xlsx':
        return (
          <div className="light-box-wrap">
            <div className="file-icon icon-filepreview-filetype-ic_excel_2x" />
            <div className="light-box-background" onClick={toggleToolbar} />
          </div>
        );
      case 'ppt':
      case 'pptx':
        return (
          <div className="light-box-wrap">
            <div className="file-icon icon-filepreview-filetype-ic_ppt_2x" />
            <div className="light-box-background" onClick={toggleToolbar} />
          </div>
        );
      case 'zip':
      case 'rar':
      case '7z':
        return (
          <div className="light-box-wrap">
            <div className="file-icon icon-filepreview-filetype-ic_zip_2x" />
            <div className="light-box-background" onClick={toggleToolbar} />
          </div>
        );
      default:
        return (
          <div className="light-box-wrap">
            <div className="file-icon icon-filepreview-filetype-ic_unknow_2x" />
            <div className="light-box-background" onClick={toggleToolbar} />
          </div>
        );
    }
  }

  render() {
    const {
      imgOriginSize, imgScale, imgOffset,
      fileIndex, fileList,
      isToolbarShow, isFileListShow,
      isSizeBoxShow, isResizable,
    } = this.props.filePreview;
    const {
      setImgSize, setImgScale, setImgOffset,
      toggleFilePreviewMode, toggleSizeBox,
      toggleFileList, setFileIndex,
    } = this.props.actions.filePreview;
    const attachmentSrc = (fileList[fileIndex]) ? this.getFileUrlPrefix('local') + fileList[fileIndex].attachmentSrc : '';
    const newTabSrc = (fileList[fileIndex]) ? this.getFileUrlPrefix('local') + fileList[fileIndex].newTabSrc : '';
    return (
      <div className="file-preview-wrap">
        <Header
          isResizable={isResizable}
          isToolbarShow={isToolbarShow}
          isSizeBoxShow={isSizeBoxShow}
          imgOriginSize={imgOriginSize}
          setImgSize={setImgSize}
          setImgScale={setImgScale}
          setImgOffset={setImgOffset}
          toggleFilePreviewMode={toggleFilePreviewMode}
          toggleSizeBox={toggleSizeBox}
          attachmentSrc={attachmentSrc}
          newTabSrc={newTabSrc}
        />
        {(isSizeBoxShow && isResizable) ?
          <SizeCtrlPanel
            isToolbarShow={isToolbarShow}
            imgOriginSize={imgOriginSize}
            imgScale={imgScale}
            imgOffset={imgOffset}
            setImgSize={setImgSize}
            setImgScale={setImgScale}
            setImgOffset={setImgOffset}
          />
          : null
        }
        {this.renderFileViewer()}
        <Footer
          fileIndex={fileIndex}
          fileList={fileList}
          isFileListShow={isFileListShow}
          toggleFileList={toggleFileList}
          setFileIndex={setFileIndex}
          isToolbarShow={isToolbarShow}
          baseUrl={this.getFileUrlPrefix('local')}
        />
      </div>
    );
  }
}
