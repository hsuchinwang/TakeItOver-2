import React, { Component, PropTypes } from 'react';
import ExportPrototype from './ExportPrototype';

export default class ExportFormat extends Component {

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
    // isSelected
    // my : Export my notebook
    // select : Export the selected notebooks
    if (this.refs.export.getSelectedRadio() === 'my') return { fileList: null };

    const notebooks = this.refs.export.getCheckedBooks();
    if (notebooks === '') return false;
    return { fileList: notebooks, type: 'ns3' };
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

  handleNotebookListFocus() {
    this.setState({ isSelected: 'select' });
  }

  render() {
    const { notebookList, getNotebookList, setWindowErrorMessage } = this.props;
    const { lang } = this.context;
    const radioButtons = [
      {
        id: 'my',
        title: lang.window_exportFirstStep_export_notebook_my,
      },
      {
        id: 'select',
        title: lang.window_exportFirstStep_export_notebook_select,
      },
    ];

    return <ExportPrototype className="export"
      ref="export"
      radioButtons={radioButtons}
      notebookList={notebookList}
      getNotebookList={getNotebookList}
      notebookListFocusEvent={this.handleNotebookListFocus}
      setWindowErrorMessage={setWindowErrorMessage}
    />;
  }
}
