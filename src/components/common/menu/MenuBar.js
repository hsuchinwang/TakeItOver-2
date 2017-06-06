import React, { PropTypes } from 'react';
import Menu from './Menu';

class MenuBar extends React.Component {

  static contextTypes = {
    lang: PropTypes.object.isRequired,
    envPlatform: PropTypes.string.isRequired,
  };

  constructor(props, context) {
    super(props);
    this.state = {
      menus: [
        {
          className: 'icon-menu-btn_category_mount_noraml',
          activeIcon: 'icon-menu-btn_category_mount_active',
          src: 'mount',
          name: 'mount',
          title: context.lang.tooltip_menu_mount,
          isTop: true,
          isBottom: false,
          setGA: props.actions.sys.setGAEvent.bind(this, 'MainMenu', 'mount'),
        },
        {
          className: 'icon-menu-btn_category_notebook_normal',
          activeIcon: 'icon-menu-btn_category_notebook_active',
          src: '/notebook',
          name: 'notebook',
          title: context.lang.tooltip_menu_notebook,
          isTop: false,
          isBottom: false,
          setGA: props.actions.sys.setGAEvent.bind(this, 'MainMenu', 'notebook'),
        },
        {
          className: 'icon-menu-btn_category_tag_normal',
          activeIcon: 'icon-menu-btn_category_tag_active',
          src: '/tag',
          name: 'tag',
          title: context.lang.tooltip_menu_tag,
          isTop: false,
          isBottom: false,
          setGA: props.actions.sys.setGAEvent.bind(this, 'MainMenu', 'tag'),
        },
        {
          className: 'icon-menu-btn_category_share_normal',
          activeIcon: 'icon-menu-btn_category_share_active',
          src: '/share',
          name: 'share',
          title: context.lang.tooltip_menu_share,
          isTop: false,
          isBottom: false,
          setGA: props.actions.sys.setGAEvent.bind(this, 'MainMenu', 'share'),
        },
      ],
    };
  }

  render() {
    const {
      history,
      actions: {
        sys: { setWindow },
      },
    } = this.props;
    const { envPlatform } = this.context;
    const path = this.props.location.pathname.split('/')[1];
    const topMenu = [];
    const normalMenu = [];
    const bottomMenu = [];

    for (let i = 0; i < this.state.menus.length; i++) {
      const { name, title, className, activeIcon, src, setGA } = this.state.menus[i];
      let active = (name === path);
      active = (name === 'notebook' && (path === '' || path === 'section' || path === 'important' || path === 'search' || path === 'trashcan')) ? true : active;
      active = (name === 'tag' && path === 'tagNote') ? true : active;

      if (this.state.menus[i].isTop) {
        topMenu.push(
          <Menu
            key={i}
            name={name}
            title={title}
            icon={className}
            activeIcon={activeIcon}
            src={src}
            active={active}
            history={history}
            setWindow={setWindow}
            setGA={setGA}
            />
        );
      } else if (this.state.menus[i].isBottom) {
        bottomMenu.push(
          <Menu
            key={i}
            name={name}
            title={title}
            icon={className}
            activeIcon={activeIcon}
            src={src}
            active={active}
            history={history}
            setWindow={setWindow}
            setGA={setGA}
            />
        );
      } else {
        normalMenu.push(
          <Menu
            key={i}
            name={name}
            title={title}
            icon={className}
            activeIcon={activeIcon}
            src={src}
            active={active}
            history={history}
            setWindow={setWindow}
            setGA={setGA}
            />
        );
      }
    }

    return (
      <div className="qnote-navbar">
        <div className="qnote-nav-top">
          {topMenu}
        </div>
        <div className="qnote-navbar-divide" />
        <div className="qnote-nav-center">
          {normalMenu}
        </div>
        <div className="qnote-nav-bottom">
          {bottomMenu}
        </div>
      </div>
    );
  }

}

export default MenuBar;
