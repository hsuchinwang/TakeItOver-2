import React, { PropTypes } from 'react';
import classnames from 'classnames';

class MenuItem extends React.Component {

  static propTypes = {
    name: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    selected: PropTypes.bool,
    normal: PropTypes.bool,
    click: PropTypes.func,
  };

  renderItemIcon = () => {
    if (this.props.normal) return;

    return (
      <div className="menu-item-selected">
        <div className={classnames('', { 'icon-dropdown-ic_dropdown_selected': this.props.selected })} />
      </div>
    );
  };

  render() {
    const { name, selected, normal, click } = this.props;

    return (
      <div title={name} className={classnames('menu-item', { 'menu-item-normal-selected': (selected && normal) })} onClick={e => click(e, this)} >
        { this.renderItemIcon() }
        <div className="menu-item-name">{name}</div>
      </div>
    );
  }
}

export default MenuItem;
