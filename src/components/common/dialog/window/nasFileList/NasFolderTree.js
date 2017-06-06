import React, { PropTypes } from 'react';

export default class NasFolderTree extends React.Component {

  static contextTypes = {
    lang: PropTypes.object.isRequired,
  };

  static propTypes = {
    nasFolderTree: PropTypes.object,
    currentDir: PropTypes.string,
    getNasFolderTree: PropTypes.func,
    getNasFileList: PropTypes.func,
    setNasDir: PropTypes.func,
    isImage: PropTypes.bool,
    isImport: PropTypes.bool,
    isExport: PropTypes.bool,
    connectionId: PropTypes.string,
    connectionName: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.renderFolderTree = this.renderFolderTree.bind(this);
  }

  renderFolderTree(keyMap, level) {
    const {
      nasFolderTree,
      currentDir,
      isImage, isImport,
      getNasFolderTree,
      getNasFileList,
      setNasDir,
      connectionId, connectionName,
    } = this.props;
    const barIcons = [];
    for (let i = 0; i < level; i++) {
      barIcons.push(
        <div key={`${level}-${i}`} className="icon-nasfile-line" />
      );
    }

    const content = keyMap.map((item, index) => {
      const isFocus = (item === currentDir) ? 'focus' : '';
      const isEnd = (keyMap.length - 1 === index) ? '_end' : '';
      const treeItem = nasFolderTree[item] || {};
      if (treeItem && treeItem.hasChild) {
        const isNoChild = (
          (treeItem.hasChild.length === 0) && (keyMap.length - 1 === index)
        ) ? '_end' : '';
        return (
          <div key={`${item}-${index}`}>
            <div
              className={`tree-node ${isFocus}`}
              onClick={() => {
                const params = {
                  img: (isImage) ? 1 : 0,
                  ns: (isImport) ? 1 : 0,
                  username: connectionName,
                  connectionid: connectionId,
                };
                getNasFileList(params, item);
                setNasDir(item);

                const childNode = this.refs[`${item}-child`];
                const arrowIconNode = this.refs[`${item}-arrowIcon`];
                const folderIconNode = this.refs[`${item}-folderIcon`];
                const isCollapsed = (childNode.className === '');
                arrowIconNode.className = (isCollapsed) ?
                  `icon-nasfile-line_o${isEnd}` : `icon-nasfile-line_o_open${isNoChild}`;
                folderIconNode.className = (isCollapsed) ?
                  'icon-nasfile-menu_folder' : 'icon-nasfile-menu_folder_expand';
                childNode.className = (isCollapsed) ? 'tree-collapsed' : '';
              }}
            >
              {barIcons}
              <div ref={`${item}-arrowIcon`}
                className={`icon-nasfile-line_o_open${isNoChild}`}
              />
              <div ref={`${item}-folderIcon`}
                className='icon-nasfile-menu_folder_expand'
              />
              <div className="tree-item" title={treeItem.file_name}>
                {treeItem.file_name}
              </div>
            </div>
            <div ref={`${item}-child`}>
              {this.renderFolderTree(treeItem.hasChild, level + 1)}
            </div>
          </div>
        );
      }

      return (
        <div
          className={`tree-node ${isFocus}`}
          key={`${item}-${index}`}
          onClick={() => {
            const paramsFile = {
              img: (isImage) ? 1 : 0,
              ns: (isImport) ? 1 : 0,
              username: connectionName,
              connectionid: connectionId,
            };
            const paramsFolder = {
              username: connectionName,
              connectionid: connectionId,
            };
            if (this.props.isExport) paramsFolder.export = true;
            getNasFolderTree(paramsFolder, item);
            getNasFileList(paramsFile, item);
            setNasDir(item);
          }}
        >
          {barIcons}
          <div className={`icon-nasfile-line_o${isEnd}`} />
          <div className="icon-nasfile-menu_folder" />
          <div className="tree-item" title={treeItem.file_name}>
            {treeItem.file_name}
          </div>
        </div>
      );
    });
    return content;
  }

  render() {
    const {
      nasFolderTree,
      currentDir,
      isImage, isImport,
      getNasFileList,
      setNasDir,
      connectionId, connectionName,
    } = this.props;
    const isFocus = (currentDir === '') ? 'focus' : '';
    return (
      <div className="tree-wrap">
        <div
          className={`tree-node ${isFocus} tree-header`}
          onClick={() => {
            const params = {
              img: (isImage) ? 1 : 0,
              ns: (isImport) ? 1 : 0,
              username: connectionName,
              connectionid: connectionId,
            };
            getNasFileList(params);
            setNasDir();
          }}
        >
          <div className="icon-nasfile-menu_nas" />
          <div>{this.context.lang.window_choose_file_nas_tab || 'NAS - Share folder'}</div>
        </div>
        {this.renderFolderTree(nasFolderTree.rootMap, 0)}
      </div>
    );
  }
}
