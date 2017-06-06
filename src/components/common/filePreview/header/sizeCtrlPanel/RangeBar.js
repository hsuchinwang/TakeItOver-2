import React from 'react';
import { adjustOffset } from '../../utils/adjustImgOffset.js';

const rangeMin = 1, rangeMax = 99, factor = 1.4, steps = 12;
export default class RangeBar extends React.Component {

  static propTypes = {
    imgOriginSize: React.PropTypes.object.isRequired,
    imgScale: React.PropTypes.object.isRequired,
    imgOffset: React.PropTypes.object.isRequired,
    setImgSize: React.PropTypes.func.isRequired,
    setImgScale: React.PropTypes.func.isRequired,
    setImgOffset: React.PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.mouseX = 0;
    this.isDragging = false;
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
  }

  handleMouseDown(event) {
    this.isDragging = true;
    this.mouseX = event.clientX;
    const targetImg = document.getElementById('targetImg');
    if (targetImg && targetImg.style.transition != 'all 0.2s linear') {
      targetImg.style.transition = 'all 0.2s linear';
    }
  }

  handleMouseMove(event) {
    if (this.isDragging) {
      const {
        imgOriginSize, imgScale, imgOffset,
        setImgScale, setImgSize, setImgOffset
      } = this.props;
      let newRange = imgScale.range + event.clientX - this.mouseX;
      if (newRange <= rangeMin) { newRange = rangeMin; }
      else if (newRange >= rangeMax) { newRange = rangeMax; }
      const newScale = Math.floor(newRange / (rangeMax / steps)) - 5;
      if (newScale != imgScale.scale) {
        const mult = Math.floor(Math.pow(factor, newScale) * 100) / 100;
        const newSize = {
          'height': imgOriginSize.height * mult,
          'width': imgOriginSize.width * mult
        };
        const opt = {
          'delta': (event.clientX - this.mouseX > 0) ? 1 : -1,
          'imgSize': newSize,
          'offset': imgOffset
        };
        const newOffset = adjustOffset(opt);
        setImgSize(newSize);
        setImgOffset(newOffset);
      }
      setImgScale({ 'range': newRange, 'scale': newScale });
    	this.mouseX = event.clientX;
    }
  }

  handleMouseUp() {
    const { imgScale, setImgScale } = this.props;
    this.isDragging = false;
    let newRange = (imgScale.scale + 5) * (rangeMax / steps);
    if (newRange > rangeMax - 1) { newRange = rangeMax; }
    newRange = parseFloat(newRange.toFixed(1));
    setImgScale({
      'range': newRange,
      'scale': imgScale.scale
    });
  }

  render() {
    const { imgScale } = this.props;
    return (
      <div
        className="rangebar-box"
        onMouseMove={this.handleMouseMove}
        onMouseUp={this.handleMouseUp}
        onMouseLeave={this.handleMouseUp}
        onDragStart={(e) => {e.preventDefault();}}
      >
        <div className="rangebar-bar" />
        <div
          ref="dot"
          className="rangebar-dot"
          style={{ 'left': `${imgScale.range}px` }}
          onMouseDown={this.handleMouseDown}
        />
      </div>
    );
  }
}
