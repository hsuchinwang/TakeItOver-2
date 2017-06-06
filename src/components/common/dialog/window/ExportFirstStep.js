import React, { Component, PropTypes } from 'react';
import createFragment from 'react-addons-create-fragment';
/** Export Panel */
import ExportFormat from './export/ExportFormat';
import ExportOtherFormat from './export/ExportOtherFormat';
/** General */
import SwitchPanel from './SwitchPanel';
import Window from '../Window';

export default class ExportFirstStep extends Component {

  static contextTypes = {
    lang: PropTypes.object.isRequired,
  };

  static propTypes = {
    exportNotebook: PropTypes.shape({
      notebookList: PropTypes.object,
    }).isRequired,
    sys: PropTypes.shape({
      errorMessage: PropTypes.shape({
        enable: PropTypes.bool,
        text: PropTypes.string,
      }),
    }).isRequired,
    actions: PropTypes.shape({
      sys: PropTypes.shape({
        setWindow: PropTypes.func.isRequired,
        setWindowErrorMessage: PropTypes.func.isRequired,
      }).isRequired,
      'export': PropTypes.shape({
        getNotebookList: PropTypes.func.isRequired,
        initNotebookList: PropTypes.func.isRequired,
      }).isRequired,
    }),
  };

  componentWillUnmount() {
    this.props.actions.export.initNotebookList();
  }

  render() {
    const { lang } = this.context;
    const { setWindow, setWindowErrorMessage } = this.props.actions.sys;
    const { getNotebookList } = this.props.actions.export;
    const { notebookList } = this.props.exportNotebook;
    return (
      <Window
        type="exportFirstStep"
        title={lang.window_export_title}
        setWindow={setWindow}
        errorMessage={this.props.sys.errorMessage}
        apply={{
          enable: true,
          text: lang.btn_export,
          callback: () => {
            this.refs.export.doExport();
          },
        }}
        cancel={{
          enable: true,
          text: lang.btn_cancel,
        }}
      >
        <SwitchPanel>
          {createFragment({
            'export': (
              <ExportFormat
                ref="export"
                optionID={"ExportFormat"}
                optionName={lang.window_exportFirstStep_export_notebook}
                notebookList={notebookList}
                getNotebookList={getNotebookList}
                setWindowErrorMessage={setWindowErrorMessage}
                setWindow={setWindow}
              />
            ),
            'exportOtherFormat': (
              <ExportOtherFormat
                ref="export"
                optionID={"ExportOtherFormat"}
                optionName={lang.window_exportFirstStep_export_otherFormat}
                notebookList={notebookList}
                getNotebookList={getNotebookList}
                setWindowErrorMessage={setWindowErrorMessage}
                setWindow={setWindow}
              />
            ),
          })}
        </SwitchPanel>
      </Window>
    );
  }
}
