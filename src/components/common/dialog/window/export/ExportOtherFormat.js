import React, { Component, PropTypes } from 'react';
import ExportPrototype from './ExportPrototype';

export default class ExportOtherFormat extends Component {

  static contextTypes = {
    lang: PropTypes.object.isRequired,
  };

  static propTypes = {
    optionID: PropTypes.string.isRequired,
    optionName: PropTypes.string.isRequired,
    notebookList: PropTypes.object.isRequired,
    getNotebookList: PropTypes.func.isRequired,
    setWindowErrorMessage: PropTypes.func.isRequired,
    setWindow: PropTypes.func.isRequired,
  };

  getExportProps = () => {
    const notebooks = this.refs.export.getCheckedBooks();
    if (notebooks === '') return false;
    return { fileList: notebooks, type: 'pdf' };
  };

  doExport = () => {
    const { setWindow, setWindowErrorMessage } = this.props;
    const passProps = this.getExportProps();

    if (passProps !== false) {
      setWindow('ExportSecondStep', 0, passProps);
    } else {
      setWindowErrorMessage(this.context.lang.window_export_error_mustSelect);
    }
  };

  render() {
    const { notebookList, getNotebookList, setWindowErrorMessage } = this.props;
    const { lang } = this.context;
    const radioButtons = [
      {
        id: 'pdf',
        title: lang.window_exportFirstStep_export_otherFormat_pdf,
      },
      // {
      //   id: 'epub',
      //   title: lang.window_exportFirstStep_export_otherFormat_epub,
      // },
    ];
    return <ExportPrototype className="exportOtherFormat"
      ref="export"
      radioButtons={radioButtons}
      notebookList={notebookList}
      getNotebookList={getNotebookList}
      setWindowErrorMessage={setWindowErrorMessage}
    />;
  }
}
