import React, { Component, PropTypes } from 'react';
import createFragment from 'react-addons-create-fragment';
/** Import Panel */
import Import from './import/Import';
import ImportOtherFormat from './import/ImportOtherFormat';
/** General */
import SwitchPanel from './SwitchPanel';
import Window from '../Window';

export default class ImportFirstStep extends Component {
  static propTypes = {
    sys: PropTypes.shape({
      errorMessage: PropTypes.shape({
        enable: PropTypes.bool,
        text: PropTypes.string
      }),
    }).isRequired,
    actions: PropTypes.shape({
      sys: PropTypes.shape({
        setWindow: PropTypes.func.isRequired,
        setWindowErrorMessage: PropTypes.func.isRequired
      }).isRequired,
      'import': PropTypes.shape({
        importByUpload: PropTypes.func.isRequired,
      }).isRequired,
    }),
  };

  render() {
    const { setWindow, setWindowErrorMessage, setGAEvent } = this.props.actions.sys;
    const { getNasFolderTree, getNasFileList, setNasDir, initializeNasFolderFile, getNasSite } = this.props.actions.nas;
    const { nasFolderTree, nasFileList, currentDir, nasSiteList } = this.props.nas;
    const { importByUpload } = this.props.actions.import;
    return (
        <Window
          type="importFirstStep"
          title={lang_dictionary.window_importFirstStep_title}
          setWindow={setWindow}
          errorMessage={this.props.sys.errorMessage}
          apply={{
            enable: true,
            text: lang_dictionary.btn_import,
            callback: () => {
              this.refs.import.doImport();
            }
          }}
          cancel={{
            enable: true,
            text: lang_dictionary.btn_cancel
          }}
        >
          <SwitchPanel>
            {createFragment({
              'import': (
                <Import ref="import"
                  optionID={"Import"}
                  optionName={lang_dictionary.window_importFirstStep_import_notebook}
                  importByUpload={importByUpload}
                  setWindow={setWindow}
                  setWindowErrorMessage={setWindowErrorMessage}
                  setGAEvent={setGAEvent}
                  getNasFolderTree={getNasFolderTree}
                  getNasFileList={getNasFileList}
                  getNasSite={getNasSite}
                  setNasDir={setNasDir}
                  nasFolderTree={nasFolderTree}
                  nasFileList={nasFileList}
                  nasSiteList={nasSiteList}
                  currentDir={currentDir}
                  initializeNasFolderFile={initializeNasFolderFile}
                />
              ),
              // 'importOtherFormat': (
              //   <ImportOtherFormat ref="import"
              //     optionID={"ImportOtherFormat"}
              //     optionName={lang_dictionary.window_importFirstStep_import_otherFormat}
              //     setWindow={setWindow}
              //     setWindowErrorMessage={setWindowErrorMessage}
              //   />
              // )
            })}
          </SwitchPanel>
        </Window>
      );
  }
}
