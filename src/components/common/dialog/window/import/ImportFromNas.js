import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import NasFiles from '../nasFileList/NasFiles';

export default class ImportFromNas extends React.Component {

  static contextTypes = {
    lang: React.PropTypes.object.isRequired,
  };

  static propTypes = {
    getNasFolderTree: React.PropTypes.func.isRequired,
    getNasFileList: React.PropTypes.func.isRequired,
    setNasDir: React.PropTypes.func.isRequired,
    nasFolderTree: React.PropTypes.object.isRequired,
    nasFileList: React.PropTypes.array.isRequired,
    nasSiteList: React.PropTypes.array.isRequired,
    currentDir: React.PropTypes.string.isRequired,
    initializeNasFolderFile: React.PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      errMsgEnable: false,
      nasParams: { path: '' },
    };
  }

  renderButtons = (apply, cancel) => {
    if ((apply && apply.enable) || (cancel && cancel.enable)) {
      return (
        <div className="buttons">
          { apply.enable ? <div className={ apply.disable ? 'btn-disable _nas_import' : 'btn-submit _nas_import'}>{ apply.text }</div> : null }
          { cancel.enable ? <div className="btn-cancel _nas_import">{ cancel.text }</div> : null }
        </div>
      );
    }
    return null;
  };

  handleClick = (e) => {
    const { nasSiteList } = this.props;
    switch (e.target.className) {
      case 'btn-submit _nas_import': {
        if (this.refs.nasFiles.refs.filePath.value === '') {
          this.setState({ errMsgEnable: true });
          return;
        }
        const nasPath = this.refs.nasFiles.refs.filePath.value;
        const index = this.refs.nasFiles.menuIndex;
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
        this.props.closeDialog(params);
        break;
      }
      case 'close _nas_import':
      case 'btn-cancel _nas_import':
        this.props.closeDialog();
        break;
      default:
    }
  };

  render() {
    const { lang } = this.context;
    const content = (
      <NasFiles ref="nasFiles"
        {...this.props}
        isImport={true}
        parent="ImportFirstStep"
        parentPara={{}}
      />
    );
    const apply = {
      enable: true,
      text: lang.btn_apply,
    };
    const cancel = {
      enable: true,
      text: lang.btn_cancel,
    };
    return (
      <div className="qnote-mask" style={{ position: 'fixed', zIndex: 9 }}>
        <div className={"window-importFromNas"} onClick={this.handleClick}>
          <div className="close _nas_import" />
          <div className="header">
            <div className="title-wrapper">
              <div className="title">
                {lang.window_importFirstStep_nas_title || 'Choose file from NAS'}
              </div>
            </div>
            <div className="hr" />
          </div>
          <div className="container">
            { content }
          </div>
          <div className="footer">
            <ReactCSSTransitionGroup transitionEnterTimeout={ 200 } transitionLeaveTimeout={ 250 } transitionName="showHide">
              { this.state.errMsgEnable ?
                <div className="errorMessage">
                  {lang.window_import_error_mustChooseFile || 'Please choose file.'}
                </div>
                 : null
              }
            </ReactCSSTransitionGroup>
            { this.renderButtons(apply, cancel) }
          </div>
        </div>
      </div>
    );
  }
}
