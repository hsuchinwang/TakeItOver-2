import React, { PropTypes, Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import classnames from 'classnames';
import MenuItem from './MenuItem';

class DropDownMenu extends Component {
  static propTypes = {
    menus: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      displayName: PropTypes.string,
      value: PropTypes.any,
    })),
    normal: PropTypes.bool,
    disabled: PropTypes.bool,
    selected: PropTypes.number,
    onchange: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      selected: props.selected ? props.selected : 0,
      open: false,
      width: 130,
    };
  }

  componentDidMount() {
    const { width } = this.refs.dropdown.getBoundingClientRect();
    this.setState({ width });
  }

  componentWillUpdate(nextProps) {
    if (this.props.menus.length !== nextProps.menus.length) {
      this.setState({ selected: 0 });
      return false;
    }
    return true;
  }

  componentDidUpdate(prevProps) {
    const { selected, onchange, menus } = this.props;
    if (this.state.open && this.refs.dropdownMenu) {
      this.refs.dropdownMenu.focus();
    }
    if (prevProps.selected !== selected) {
      this.setState({ selected });
      if (onchange) onchange(selected, menus[selected].value);
    }
  }

  getSelected = () => {
    const { selected } = this.state;
    const { value } = this.props.menus[selected];
    return (value === null || value === undefined) ? selected : value;
  };

  setSelected = (index = 0) => {
    this.setState({
      selected: index,
    });
  };

  handleSelect = (e, that) => {
    const { onchange, menus } = this.props;
    if (onchange && this.state.selected !== that.props.index) onchange(that.props.index, menus[that.props.index].value);
    this.setState({
      selected: that.props.index,
    });
    this.refs.dropdownMenu.blur();
  };

  handleBlur = () => {
    this.setState({
      open: false,
    });
  };

  handleClick = (e) => {
    if (this.props.disabled) return;
    if (!e.target.className.match(/menu-item|menu-item-name/) && !this.refs.dropdownMenu) {
      this.setState({ open: true });
    }
  };

  renderMenu = () => {
    const { menus, normal } = this.props;
    if (!menus || !this.state.open) return null;
    const meun = menus.map((obj, index) => {
      const { displayName, name } = obj;
      return (<MenuItem key={`item-${index}`} index={index} name={displayName || name} selected={this.state.selected === index} normal={(normal)} click={this.handleSelect} />);
    });
    return (
      <div className="drop-down-bar" style={{ width: `${this.state.width - 2}px` }} ref="dropdownMenu" tabIndex={-1} onBlur={this.handleBlur}>
        {meun}
      </div>
    );
  };

  render() {
    const { menus, disabled } = this.props;
    const { open } = this.state;
    let { selected } = this.state;
    selected = (selected >= menus.length) ? 0 : selected;

    return (
      <div title={menus.length === 0 ? '' : menus[selected].name} className={classnames('drop-down-menu', { 'drop-down-menu-disable': disabled })} onClick={this.handleClick} ref="dropdown">
        <input className="text" ref="selectedItem" type="text" value={menus.length === 0 ? '' : menus[selected].name} readOnly="readonly" size="1" />
        <div className="drop-down-btn">
          <div className={open ? 'icon-dropdown-btn_triangle_up' : 'icon-dropdown-btn_triangle_down'} />
        </div>
        <div className="drop-down-bar-container">
          <ReactCSSTransitionGroup transitionEnterTimeout={200} transitionLeaveTimeout={250} transitionName="showHide">
            {this.renderMenu()}
          </ReactCSSTransitionGroup>
        </div>
      </div>
    );
  }
}

export default DropDownMenu;
