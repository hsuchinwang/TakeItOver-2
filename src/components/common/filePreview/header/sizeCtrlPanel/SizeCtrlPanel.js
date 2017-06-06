import React from 'react';
import RangeBar from './RangeBar.js';
import { adjustOffsetToCenter } from '../../utils/adjustImgOffset.js';

const factor = 1.4;
export default class SizeCtrlPanel extends React.Component {

  static propTypes = {
    imgOriginSize: React.PropTypes.object.isRequired,
    imgScale: React.PropTypes.object.isRequired,
    imgOffset: React.PropTypes.object.isRequired,
    setImgSize: React.PropTypes.func.isRequired,
    setImgScale: React.PropTypes.func.isRequired,
    setImgOffset: React.PropTypes.func.isRequired,
    isToolbarShow: React.PropTypes.bool.isRequired
  };

  constructor(props) {
    super(props);
    this.resetImgSize = this.resetImgSize.bind(this);
  }

  resetImgSize() {
    const {
      imgOriginSize,
      setImgSize, 
      setImgScale, 
      setImgOffset
    } = this.props;
    const newOffset = adjustOffsetToCenter(imgOriginSize);
    setImgScale({ 'scale': 0, 'range': 41 });
    setImgSize(imgOriginSize);
    setImgOffset(newOffset);
  }

  render() {
    const { imgScale } = this.props;
    const style = this.props.isToolbarShow ? {} : { 'top': '-61px' };
    return (
      <div className="size-ctrl-panel" style={style}>
        <div className="size-ctrl-panel-scale">
          {`${Math.floor(Math.pow(factor, imgScale.scale) * 100)}%`}
        </div>
        <RangeBar {...this.props} />
        <div
          title={lang_dictionary.file_preview_origin_size || 'Original size'}
          className="size-ctrl-panel-reset"
          onClick={this.resetImgSize}
        >
          {"1:1"}
        </div>
      </div>
    );
  }
}
