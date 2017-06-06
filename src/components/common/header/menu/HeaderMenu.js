import React, { Component, PropTypes } from 'react';

export default class HeaderMenu extends Component {
  static propTypes = {
    className: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    getParentPostion: PropTypes.func.isRequired,
    blurCallback: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      style: {},
    };
    window.addEventListener('resize', this.handleWidowResize);
  }

  componentDidMount() {
    this.initSizeAndFocus();
  }

  componentDidUpdate(prevProps) {
    if (this.props.id !== prevProps.id) {
      this.initSizeAndFocus();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWidowResize);
  }

  initSizeAndFocus() {
    this.handleWidowResize();
    this.refs[this.props.id].focus();
  }

  caculatePosition = () => {
    const { id, getParentPostion } = this.props;
    const { right, bottom } = getParentPostion();
    const { width } = this.refs[id].getBoundingClientRect();
    return {
      left: `${right - width}px`,
      top: `${bottom + 12}px`,
    };
  };

  handleWidowResize = () => {
    this.setState({
      style: this.caculatePosition(),
    });
  };

  render() {
    const { className, id, blurCallback, children } = this.props;
    return (
      <div className={className} key={id} ref={id} tabIndex={-1} style={this.state.style} onBlur={blurCallback}>
        {children}
      </div>
    );
  }
}
