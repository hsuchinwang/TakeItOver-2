import React from 'react';

const itemWidth = 56, itemsWrapOffset = 83;
export default class FileList extends React.Component {

  static propTypes = {
    fileList: React.PropTypes.array.isRequired,
    fileIndex: React.PropTypes.number.isRequired,
    setFileIndex: React.PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.renderThumbnailItems = this.renderThumbnailItems.bind(this);
  }

  renderThumbnailItems() {
    const { fileList, fileIndex, setFileIndex, baseUrl } = this.props;
    const thumbnailItems = fileList.map((item, index) => {
      const isSrcExist = (item.thumbnailSrc && item.thumbnailSrc != '');
      const thumbnail = (isSrcExist) ? <img src={`${baseUrl}${item.thumbnailSrc}`} className="img" /> : null;
      let icon = '';
      if (!isSrcExist) {
        switch (item.ext) {
          case 'jpg':
          case 'png':
          case 'gif':
            icon = 'icon-filepreview-filetype-ic_image icon';
            break;
          case 'mp4':
          case 'm4a':
          case 'mp3':
            icon = 'icon-filepreview-filetype-ic_audio icon';
            break;
          case 'pdf':
            icon = 'icon-filepreview-filetype-ic_pdf icon';
            break;
          case 'doc':
          case 'docx':
            icon = 'icon-filepreview-filetype-ic_word icon';
            break;
          case 'xls':
          case 'xlsx':
            icon = 'icon-filepreview-filetype-ic_excel icon';
            break;
          case 'ppt':
          case 'pptx':
            icon = 'icon-filepreview-filetype-ic_ppt icon';
            break;
          case 'zip':
          case 'rar':
          case '7z':
            icon = 'icon-filepreview-filetype-ic_zip icon';
            break;
          default:
            icon = 'icon-filepreview-filetype-ic_unknow icon';
            break;
        }
      }
      const style = (fileIndex == index) ? `thumbnail-item focus ${icon}`:`thumbnail-item ${icon}`;
      return (
        <div
          key={index} title={item.originName}
          onClick={() => {setFileIndex(index);}}
          className={style}
        >
          {thumbnail}
        </div>
      );
    });
    return thumbnailItems;
  }

  render() {
  	  const { fileList, fileIndex, setFileIndex } = this.props;
    const windowWidth = window.innerWidth;
  	  const left = (windowWidth / 2) - (itemWidth * fileIndex) - (itemsWrapOffset + itemWidth / 2);
  	  const shift = Math.floor((windowWidth - itemsWrapOffset * 2) / (itemWidth * 2));
    return (
    <div className="footer-file-list">
      {(fileIndex <= 0 || fileList.length < shift)?
        <div className="thumbnail-btn-end" /> :
        <div
          className="thumbnail-btn left"
          onClick={() => {setFileIndex(fileIndex - shift);}}
        />
      }
		  <div className="thumbnail-list">
			  <div
  className="thumbnail-item-wrap"
  style={{ 'left': `${left}px` }}
    >
			    {this.renderThumbnailItems()}
			  </div>
		  </div>
      {(fileIndex >= fileList.length - 1 || fileList.length < shift)?
        <div className="thumbnail-btn-end" /> :
        <div
          className='thumbnail-btn right'
          onClick={() => {setFileIndex(fileIndex + shift);}}
        />
      }
		</div>
    );
  }
}
