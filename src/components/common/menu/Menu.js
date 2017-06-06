import React, { PropTypes } from 'react';
import classnames from 'classnames';

class Menu extends React.Component {

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  static propTypes = {
    src: PropTypes.string.isRequired,
    setWindow: PropTypes.func.isRequired,
    icon: PropTypes.string.isRequired,
    setGA: PropTypes.func.isRequired,
    activeIcon: PropTypes.string.isRequired,
    active: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  };

  handleClick = () => {
    this.props.setGA();
    if (this.props.src === 'mount') {
      this.props.setWindow('Mount');
      return;
    }
    this.context.router.push(this.props.src);
  };

  render() {
    const { icon, activeIcon, active, name } = this.props;
    const menuIcon = active ? activeIcon : icon;

    return (
      <div id={`menu-${name}`} className={classnames('qnote-menu', { 'qnote-menu-selected': active })} onClick={this.handleClick}>
        <div className={menuIcon} title={this.props.title} />
      </div>
    );
  }
}

export default Menu;
