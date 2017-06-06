import React, { Component, PropTypes } from 'react';
import Export from './export/Export';

export default class ExportSecondStep extends Component {

  static contextTypes = {
    lang: PropTypes.object.isRequired,
  }

  static propTypes = {
    actions: PropTypes.shape({
      sys: PropTypes.shape({
        setWindow: PropTypes.func.isRequired,
        setGAEvent: PropTypes.func.isRequired,
        setTabSelected: PropTypes.func.isRequired,
      }).isRequired,
      export: PropTypes.shape({
        exportByDownload: PropTypes.func.isRequired,
      }).isRequired,
      nas: PropTypes.shape({
        initializeNasFolderFile: PropTypes.func.isRequired,
        getNasFolderTree: PropTypes.func.isRequired,
        getNasFileList: PropTypes.func.isRequired,
        setNasDir: PropTypes.func.isRequired,
      }).isRequired,
    }),
    sys: PropTypes.shape({
      windowPara: PropTypes.shape({
        fileList: PropTypes.string,
      }).isRequired,
      tabSelected: PropTypes.number.isRequired,
    }),
    nas: PropTypes.shape({
      nasFolderTree: PropTypes.object.isRequired,
      currentDir: PropTypes.string.isRequired,
    }),
  };

  render() {
    return (
      <Export {...this.props} />
    );
  }
}
