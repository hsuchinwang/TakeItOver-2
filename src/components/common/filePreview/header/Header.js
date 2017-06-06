import React from 'react';
import { VERSION_NAME } from '../../../../constants/Config';
import { adjustOffsetToCenter } from '../utils/adjustImgOffset.js';

const rangeMin = 1, rangeMax = 99, factor = 1.4, steps = 12;
export default class Header extends React.Component {

  static contextTypes = {
    lang: React.PropTypes.object.isRequired,
  };

  static propTypes = {
    imgOriginSize: React.PropTypes.object.isRequired,
    setImgSize: React.PropTypes.func.isRequired,
    setImgScale: React.PropTypes.func.isRequired,
    setImgOffset: React.PropTypes.func.isRequired,
    toggleFilePreviewMode: React.PropTypes.func.isRequired,
    toggleSizeBox: React.PropTypes.func.isRequired,
    attachmentSrc: React.PropTypes.string.isRequired,
    newTabSrc: React.PropTypes.string.isRequired,
    isSizeBoxShow: React.PropTypes.bool.isRequired,
    isResizable: React.PropTypes.bool.isRequired,
    isToolbarShow: React.PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);
    this.fitImgToWindow = this.fitImgToWindow.bind(this);
    this.renderRightWrap = this.renderRightWrap.bind(this);
  }

  fitImgToWindow() {
    const targetImg = document.getElementById('targetImg');
    if (targetImg && targetImg.style.transition != 'all 0.2s linear') {
      targetImg.style.transition = 'all 0.2s linear';
    }
    const {
      imgOriginSize,
      setImgSize,
      setImgScale,
      setImgOffset,
    } = this.props;
    const windowSize = {
      height: window.innerHeight,
      width: window.innerWidth,
    };
    let mult = 0;
    if (windowSize.width < imgOriginSize.width) {
      mult = (windowSize.width / imgOriginSize.width);
    } else {
      mult = (windowSize.height / imgOriginSize.height);
    }
    const newSize = {
      height: imgOriginSize.height * mult,
      width: imgOriginSize.width * mult,
    };

    let newScale = (Math.round(mult * 100)) / 100;
    newScale = (Math.log(newScale) / Math.log(factor));

    let newRange = (newScale + 5) * (rangeMax / steps);
    newRange = parseFloat(newRange.toFixed(1));
    if (newRange > rangeMax) {
      newRange = rangeMax;
    } else if (newRange < rangeMin) {
      newRange = rangeMin;
    }

    const newOffset = adjustOffsetToCenter(newSize, windowSize);

    setImgScale({ scale: newScale, range: newRange });
    setImgSize(newSize);
    setImgOffset(newOffset);
  }

  renderRightWrap() {
    const {
      toggleSizeBox, attachmentSrc, newTabSrc,
      isSizeBoxShow, isResizable,
    } = this.props;
    const { lang } = this.context;
    const extendIcon = (isSizeBoxShow) ? 'icon-filepreview-extend_active' : 'icon-filepreview-extend';
    return (
      <div className="header-btn-wrap">
        {(isResizable) ?
          <div
            onClick={toggleSizeBox}
            title={lang.file_preview_zoom_size || 'Adjust size'}
            className={`header-btn ${extendIcon}`}
          />
          : null
        }
        {(isResizable) ?
          <a
            href={newTabSrc}
            className="header-btn icon-filepreview-newtab"
            target="_blank"
            title={lang.file_preview_new_tab || 'Open in new tab'}
          />
          : null
        }
        <a
          href={newTabSrc}
          className="header-btn icon-filepreview-download"
          target="_blank"
          title={lang.file_preview_download || 'Download file'}
          download
        />
        {(isResizable) ?
          <div
            onClick={this.fitImgToWindow}
            title={lang.file_preview_fit_size || 'Fit window'}
            className="header-btn icon-filepreview-max"
          />
          : null
        }
      </div>
    );
  }

  render() {
    const {
      toggleFilePreviewMode,
      isToolbarShow,
      isSizeBoxShow,
    } = this.props;
    const { lang } = this.context;
    const top = (isSizeBoxShow) ? '-105px' : '-44px';
    const style = (isToolbarShow) ? {} : { top };
    return (
      <div className="header-wrap" style={style}>
        <div
          className="header-btn-close"
          onClick={toggleFilePreviewMode}
          onMouseDown={(e) => {
            e.target.style.color = '#0FF';
            this.refs.backIcon.className = 'icon-filepreview-back_active';
          }}
          onMouseUp={(e) => {
            e.target.style.color = '';
            this.refs.backIcon.className = 'icon-filepreview-back';
          }}
          onMouseLeave={(e) => {
            e.target.style.color = '';
            this.refs.backIcon.className = 'icon-filepreview-back';
          }}
        >
          <div className="icon-filepreview-back" ref='backIcon' />
          <div title={`${lang.file_preview_back} ${VERSION_NAME}`} className="header-btn-close-text">
            {`${lang.file_preview_back} ${VERSION_NAME}`}
          </div>
        </div>
        {this.renderRightWrap()}
      </div>
    );
  }
}
