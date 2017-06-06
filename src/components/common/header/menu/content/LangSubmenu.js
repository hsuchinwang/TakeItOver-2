import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';

export default class LangSubmenu extends Component {
  static propTypes = {
    getParentPostion: PropTypes.func.isRequired,
    setLang: PropTypes.func.isRequired,
    defaultLang: PropTypes.string.isRequired,
    langList: PropTypes.arrayOf(PropTypes.shape({
      key: PropTypes.string,
      value: PropTypes.string,
    })),
  };

  constructor(props) {
    super(props);
    this.state = {
      style: {},
      selectedItem: this.getDefaultSelectIndex(props.langList, props.defaultLang),
    };
    window.addEventListener('resize', this.handleWidowResize);
  }

  componentDidMount() {
    this.handleWidowResize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWidowResize);
  }

  getDefaultSelectIndex = (list, select) => {
    let index;
    for (let i = list.length - 1; i >= 0; i--) {
      if (list[i].key === select) {
        index = i;
        break;
      }
    }
    return index;
  };

  caculatePosition = () => {
    const { left: parentLeft, right: parentRight, top: parentTop, width: parentWidth } = this.props.getParentPostion();
    const { width } = this.refs.submenu.getBoundingClientRect();
    let left;
    if (parentRight + width > window.innerWidth) {
      left = `${parentLeft - width}px`;
    } else {
      left = `${parentRight}px`;
    }

    return {
      left,
      top: `${parentTop}px`,
      width: `${parentWidth * 0.8}px`,
      maxHeight: `${window.innerHeight - parentTop - 40}px`,
    };
  };

  handleWidowResize = () => {
    this.setState({ style: this.caculatePosition() });
  };

  handleMenuItemClick = (index, key) => {
    this.setState({
      selectedItem: index,
    });
    this.props.setLang(key);
  };

  renderMenuItems = () => {
    const { langList } = this.props;

    return langList.map((item, index) => {
      const { key, value } = item;
      return (
        <div
          key={`language-${index}`}
          className={classnames('submenu-item', { selected: index == this.state.selectedItem })}
          onClick={this.handleMenuItemClick.bind(this, index, key)}
        >
          <div className="icon" / >
          <div className="text">{value}</div>
        </div>
      );
    });
  };

  render() {
    return (
      <div className="submenu" ref="submenu" style={this.state.style} >
        {this.renderMenuItems()}
      </div>
    );
  }

}
