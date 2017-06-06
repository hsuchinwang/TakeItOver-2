import React, { Component, PropTypes } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import ImportPrototype from './ImportPrototype';
import ImportFromNas from './ImportFromNas';

export default class Import extends Component {

  static contextTypes = {
    lang: PropTypes.object.isRequired,
  };

  static propTypes = {
    optionID: PropTypes.string.isRequired,
    optionName: PropTypes.string.isRequired,
    importByUpload: PropTypes.func.isRequired,
    setWindowErrorMessage: PropTypes.func.isRequired,
    setWindow: PropTypes.func.isRequired,
    setGAEvent: PropTypes.func.isRequired,
    getNasFolderTree: PropTypes.func.isRequired,
    getNasFileList: PropTypes.func.isRequired,
    getNasSite: PropTypes.func.isRequired,
    setNasDir: PropTypes.func.isRequired,
    nasFolderTree: PropTypes.object,
    nasFileList: PropTypes.array,
    nasSiteList: PropTypes.array,
    currentDir: PropTypes.string,
    initializeNasFolderFile: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      isNasDialogToggle: false,
      nasParams: { path: '' },
    };
  }

  componentWillMount() {
    this.props.getNasSite();
  }

  doImport = () => {
    const { lang } = this.context;
    const { importByUpload, setWindow, setGAEvent, setWindowErrorMessage } = this.props;
    const formData = new FormData();
    switch (this.refs.import.state.isSelected) {
      case 0:
        const files = this.refs.file.files;
        if (!this.validateCallback(files)) {
          setWindowErrorMessage(
            lang.window_import_error_mustChooseFile || 'Please choose file.'
          );
          return;
        }

        for (let i = 0; i < files.length; i++) {
          formData.append('import_files[]', files[i]);
        }
        importByUpload(formData, () => {
          setWindow(null);
        });
        break;
      case 1:
        const { nasParams } = this.state;
        if (nasParams.path === '') {
          setWindowErrorMessage(
            lang.window_import_error_mustChooseFile || 'Please choose file.'
          );
          return;
        }
        if (nasParams.local) formData.append('nasPath', nasParams.path);
        else {
          formData.append('remoteList', JSON.stringify({
            remoteNasPath: nasParams.path,
            username: nasParams.username,
            connectionid: nasParams.connectionid,
          }));
        }
        importByUpload(formData, () => {
          setWindow(null);
        });
        break;
      default:
        return;
    }
    setGAEvent('MainMenu', 'Import');
  };

  validateCallback = (files) => {
    if (files && files.length > 0) return true;
    return false;
  };

  render() {
    const { lang } = this.context;
    const radioButtons = [
      {
        id: 'local',
        title: lang.window_importFirstStep_import_notebook_local,
      },
      {
        id: 'nas',
        title: lang.window_importFirstStep_import_notebook_nas,
      },
    ];
    return (
      <ImportPrototype className="import"
        ref="import"
        radioButtons={radioButtons}
      >
        <div className="importFromLocal">
          <form className="import_form" action="#" encType="multipart/form-data">
            <input type="file" ref="file" name="import_files[]" multiple accept=".ns3,.qnsx" />
          </form>
        </div>
        <div className="importFromNASPanel">
          <input type="text" className="nasPath" value={this.state.nasParams.path} readOnly />
          <button className="openNasFile" onClick={() => { this.setState({ isNasDialogToggle: true }); }} >
            {"..."}
          </button>
          <ReactCSSTransitionGroup transitionEnterTimeout={ 200 } transitionLeaveTimeout={ 250 } transitionName="showHide">
            {(this.state.isNasDialogToggle) ?
              <ImportFromNas
                {...this.props}
                closeDialog={(params = { path: '' }) => {
                  this.setState({
                    isNasDialogToggle: false,
                    nasParams: params,
                  });
                }}
              />
              : null
            }
          </ReactCSSTransitionGroup>
        </div>
      </ImportPrototype>
    );
  }
}
