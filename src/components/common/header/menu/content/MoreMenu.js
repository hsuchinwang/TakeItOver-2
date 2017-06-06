import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import LangSubmenu from './LangSubmenu';

export default class Menu extends Component {

  static contextTypes = {
    lang: PropTypes.object.isRequired,
    envPlatform: PropTypes.string.isRequired,
  };

  static propTypes = {
    defaultLang: PropTypes.string.isRequired,
    langList: PropTypes.arrayOf(PropTypes.shape({
      key: PropTypes.string,
      value: PropTypes.string,
    })),
    setLang: PropTypes.func.isRequired,
    migrate: PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]).isRequired,
    getParentPostion: PropTypes.func.isRequired,
    blurCallback: PropTypes.func.isRequired,
    itemCallback: PropTypes.shape({
      import: PropTypes.func,
      export: PropTypes.func,
      migrate: PropTypes.func,
      setting: PropTypes.func,
      sync: PropTypes.func,
      hybrid: PropTypes.func,
      language: PropTypes.func,
      tutorial: PropTypes.func,
      about: PropTypes.func,
    }).isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      submenuState: {
        isEnabled: false,
        parentId: null,
      },
    };
  }

  getMenuItemPosition = (iconInstance) => {
    const { left, right, top, width } = iconInstance.getBoundingClientRect();
    return { left, right, top, width };
  };

  handleMenuItemMouseEnter = (parentId, hasSubmenu) => {
    if (this.state.parentId !== parentId) {
      this.setState({
        submenuState: {
          parentId: hasSubmenu ? parentId : null,
          isEnabled: hasSubmenu,
        },
      });
    }
  };

  handleMenuItemClick = (callback, clickTriggerMenuBlur) => {
    callback();
    if (clickTriggerMenuBlur) {
      this.props.blurCallback();
    }
  };

  renderMenuItems = () => {
    const { itemCallback, migrate } = this.props;
    const { lang, envPlatform } = this.context;
    const items = [
      {
        type: 'item',
        key: 'import',
        text: lang.header_more_import,
        more: false,
        clickTriggerMenuBlur: true,
      },
      {
        type: 'item',
        key: 'export',
        text: lang.header_more_export,
        more: false,
        clickTriggerMenuBlur: true,
      },
      {
        type: 'divide',
        key: 'divide',
      },
        envPlatform !== 'nas' &&
        {
          type: 'item',
          key: 'sync',
          text: lang.header_more_sync,
          more: false,
          clickTriggerMenuBlur: true,
        },
      {
        type: 'item',
        key: 'hybrid',
        text: lang.header_more_hybrid_connection,
        more: false,
        clickTriggerMenuBlur: true,
      },
      {
        type: 'item',
        key: 'setting',
        text: lang.header_more_setting,
        more: false,
        clickTriggerMenuBlur: true,
      },
      {
        type: 'divide',
        key: 'divide',
      },
      {
        type: 'item',
        key: 'language',
        text: lang.header_more_language,
        more: true,
        clickTriggerMenuBlur: false,
      },
      {
        type: 'item',
        key: 'tutorial',
        text: lang.general_tutorial,
        more: false,
        clickTriggerMenuBlur: true,
      },
      {
        type: 'item',
        key: 'about',
        text: lang.header_more_about,
        more: false,
        clickTriggerMenuBlur: true,
      },
    ].filter((item) => item);

    if (envPlatform === 'nas' && +migrate === 1) {
      items.splice(2, 0, {
        type: 'item',
        key: 'migrate',
        text: lang.header_more_migrate_old,
        more: false,
        clickTriggerMenuBlur: true,
      });
    }

    return items.map((item, index) => {
      const { type, key, text, more, clickTriggerMenuBlur } = item;

      if (type === 'divide') return <hr key={`key-${index}`} />;
      return (
        <div
          key={key}
          ref={key}
          className={classnames('menu-item', { more, selected: this.state.submenuState.parentId === key })}
          onClick={this.handleMenuItemClick.bind(this, itemCallback[key], clickTriggerMenuBlur)}
          onMouseEnter={this.handleMenuItemMouseEnter.bind(this, key, more)}
        >
          <div className="text">{text}</div>
          {more ? <div className="icon-dropdown-ic_list_more" /> : null}
        </div>
      );
    });
  };

  renderLangSubmenu = () => {
    const { isEnabled, parentId } = this.state.submenuState;
    const { langList, defaultLang, setLang } = this.props;

    if (isEnabled) return <LangSubmenu getParentPostion={this.getMenuItemPosition.bind(this, this.refs[parentId])} setLang={setLang} langList={langList} defaultLang={defaultLang} />;
    return null;
  };

  render() {
    return (
      <div>
        {this.renderMenuItems()}
        {this.renderLangSubmenu()}
      </div>
    );
  }
}
