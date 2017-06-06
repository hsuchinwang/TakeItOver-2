import React from 'react';
import { adjustOffsetToCenter, adjustOffset } from '../utils/adjustImgOffset.js';

const rangeMin = 1, rangeMax = 99, factor = 1.4, steps = 12;
export default class ImgViewer extends React.Component {

  static propTypes = {
    fileList: React.PropTypes.array.isRequired,
    fileIndex: React.PropTypes.number.isRequired,
    path: React.PropTypes.string.isRequired,
    imgOriginSize: React.PropTypes.object.isRequired,
    imgSize: React.PropTypes.object.isRequired,
    imgScale: React.PropTypes.object.isRequired,
    imgOffset: React.PropTypes.object.isRequired,
    setImgOriginSize: React.PropTypes.func.isRequired,
    setImgSize: React.PropTypes.func.isRequired,
    setImgScale: React.PropTypes.func.isRequired,
    setImgOffset: React.PropTypes.func.isRequired,
    setIsResizable: React.PropTypes.func.isRequired,
    setIsWindowResized: React.PropTypes.func.isRequired,
    toggleToolbar: React.PropTypes.func.isRequired,
    baseUrl: React.PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);
    this.onImgLoaded = this.onImgLoaded.bind(this);
    this.handelWindowResize = this.handelWindowResize.bind(this);
    this.handleWheel = this.handleWheel.bind(this);
    this.handleDragStart = this.handleDragStart.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
    this.handleDragEnd = this.handleDragEnd.bind(this);
    this.preloadImage = new Image();
    this.preloadImage.onload = this.onImgLoaded;
    this.preloadImage.src = props.baseUrl + props.path;
    this.mouseX, this.mouseY = 0;
    this.isDragging = false;
    this.windowSize = {
      'height': window.innerHeight,
      'width': window.innerWidth
    };
    this.state = {
      isLoading: true
    };
  }

  componentWillMount() {
    this.props.setIsResizable(true);
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.props.path != nextProps.path) {
      if (this.refs.targetImg)
        this.refs.targetImg.style.transition = 'initial';
      this.preloadImage = new Image();
      this.preloadImage.onload = this.onImgLoaded;
      this.preloadImage.src = nextProps.baseUrl + nextProps.path;
      this.setState({ isLoading: true });
    }
    if (this.props.isWindowResized) {
      this.handelWindowResize();
      this.props.setIsWindowResized(false);
    }
  }

  componentWillUnmount() {
    this.props.setIsResizable(false);
    this.props.setImgSize({ 'height': 0, 'width': 0 });
  }

  onImgLoaded(event) {
    const {
      setImgOriginSize, setImgScale,
      setImgSize, setImgOffset, fileId
    } = this.props;
    const matchfileId = event.target.src.match(fileId)[0];
    if (matchfileId && matchfileId == fileId) {
      const naturalSize = {
        'height': event.target.naturalHeight,
        'width': event.target.naturalWidth
      };
      setImgOriginSize(naturalSize);
      if (this.windowSize.width < naturalSize.width ||
         this.windowSize.height < naturalSize.height) {
        let mult;
        if (this.windowSize.width < naturalSize.width) {
          mult = (this.windowSize.width / naturalSize.width);
        } else {
          mult = (this.windowSize.height / naturalSize.height);
        }
        const newSize = {
          'height': naturalSize.height * mult,
          'width': naturalSize.width * mult
        };

        let newScale = (Math.round(mult * 100)) / 100;
        newScale = (Math.log(newScale) / Math.log(factor));

        let newRange = (newScale + 5) * (rangeMax / steps);
        newRange = parseFloat(newRange.toFixed(1));
        if (newRange > rangeMax) { newRange = rangeMax;}
        else if (newRange < rangeMin) { newRange = rangeMin;}

        const newOffset = adjustOffsetToCenter(newSize, this.windowSize);
        setImgScale({ 'scale': newScale, 'range': newRange });
        setImgSize(newSize);
        setImgOffset(newOffset);
      } else {
        const newOffset = adjustOffsetToCenter(naturalSize, this.windowSize);
        setImgScale({ 'scale': 0, 'range': 41 });
        setImgSize(naturalSize);
        setImgOffset(newOffset);
      }
    }
    this.setState({ isLoading: false });
  }

  handelWindowResize() {
    const { imgSize, setImgOffset } = this.props;
    this.windowSize = {
      'height': window.innerHeight,
      'width': window.innerWidth
    };
    const newOffset = adjustOffsetToCenter(imgSize, this.windowSize);
    setImgOffset(newOffset);
  }

  handleWheel(event) {
    if (this.refs.targetImg)
      this.refs.targetImg.style.transition = 'all 0.2s linear';
    const {
      imgOriginSize, imgOffset,
      setImgScale, setImgSize, setImgOffset
    } = this.props;
    const scale = Math.round(this.props.imgScale.scale);
    const delta = (event.deltaY > 0) ? -1 : 1;
    let newScale = (scale + delta);
    if (newScale <= 7 && newScale >= -5) {
      const mult = Math.floor(Math.pow(factor, newScale) * 100) / 100;
      const newSize = {
        'height': imgOriginSize.height * mult,
        'width': imgOriginSize.width * mult
      };
      const opt = {
        'delta': delta,
        'imgSize': newSize,
        'offset': imgOffset
      };
      const cursor = {
        'x': event.clientX,
        'y': event.clientY
      };
      const newOffset = adjustOffset(opt, cursor, this.windowSize);
      let newRange = (newScale + 5) * (rangeMax / steps);
      newRange = parseFloat(newRange.toFixed(1));
      if (newRange > rangeMax) { newRange = rangeMax;}
      else if (newRange < rangeMin) { newRange = rangeMin;}
      setImgScale({ 'scale': newScale, 'range': newRange });
      setImgSize(newSize);
      setImgOffset(newOffset);
    }
  }

  handleDragStart(event) {
    const { imgSize, toggleToolbar } = this.props;
    toggleToolbar();
    if ((this.windowSize.height - imgSize.height) < 0 ||
       (this.windowSize.width - imgSize.width) < 0) {
      this.isDragging = true;
      this.mouseX = event.screenX;
      this.mouseY = event.screenY;
      event.target.style.transition = 'initial';
    }
  }

  handleDrag(event) {
    if (this.isDragging) {
      const {
        imgSize, imgOffset,
        setImgOffset, setIsToolbarShow
      } = this.props;
      setIsToolbarShow(false);
      const edge = {
        'top': (this.windowSize.height - imgSize.height),
        'left': (this.windowSize.width - imgSize.width)
      };

      let newTopOffset = imgOffset.top + event.screenY - this.mouseY;
      let newLeftOffset = imgOffset.left + event.screenX - this.mouseX;

      if (!(edge.top < 0 && edge.top <= newTopOffset && newTopOffset <= 0)) {
        newTopOffset = imgOffset.top;
      }
      if (!(edge.left < 0 && edge.left <= newLeftOffset && newLeftOffset <= 0)) {
        newLeftOffset = imgOffset.left;
      }

      newTopOffset = parseFloat(newTopOffset.toFixed(0));
      newLeftOffset = parseFloat(newLeftOffset.toFixed(0));

      setImgOffset({ 'top': newTopOffset, 'left': newLeftOffset });
      this.mouseX = event.screenX;
      this.mouseY = event.screenY;
    }
  }

  handleDragEnd(event) {
    this.isDragging = false;
    event.target.style.transition = 'all 0.2s linear';
  }

  render() {
    const { baseUrl, imgSize, imgOffset, path, toggleToolbar, fileIndex, fileList } = this.props;
    const { isLoading } = this.state;
    const fileName = (fileList[fileIndex]) ? fileList[fileIndex].originName : '';
    return (
      <div
        className="light-box-wrap"
        onWheel={this.handleWheel}
        ref="wrapper"
      >
        <div className="light-box-background" onClick={toggleToolbar} />
        {(isLoading)?
          <div className="file-icon icon-filepreview-filetype-ic_image_2x" title={fileName} />
          : null
        }
        {(!isLoading)?
          <img
            alt={fileName}
            title={fileName}
            src={`${baseUrl}${path}`}
            ref="targetImg"
            id="targetImg"
            className="light-box"
            onMouseDown={this.handleDragStart}
            onMouseMove={this.handleDrag}
            onMouseUp={this.handleDragEnd}
            onMouseLeave={this.handleDragEnd}
            onDragStart={(e) => {e.preventDefault();}}
            style={{
              'transition': 'initial',
              'position': 'absolute',
              'width': `${imgSize.width}px`,
              'height': `${imgSize.height}px`,
              'top': `${imgOffset.top}px`,
              'left': `${imgOffset.left}px`
            }}
          />
          : null
        }
      </div>
    );
  }
}
