import React, { Component, PropTypes } from 'react';
import ImportPrototype from './ImportPrototype';

export default class Import extends Component {
  doImport = () => {

  };

  render() {
    const { setWindowErrorMessage } = this.props;
    const radioButtons = [{
      id: 'pdf',
      title: lang_dictionary.window_importFirstStep_import_otherFormat_pdf
    }, {
        id: 'epub',
        title: lang_dictionary.window_importFirstStep_import_otherFormat_epub
      }];
    return (
      <ImportPrototype className="importOtherFormat"
        ref="import"
        radioButtons={radioButtons}
        setWindowErrorMessage={setWindowErrorMessage}
    >
        <div className="importFromPDF">
          <input type="file" />
        </div>
        <div className="importFromEPUB">
          <input type="file" />
        </div>
      </ImportPrototype>
    );
  }
}
