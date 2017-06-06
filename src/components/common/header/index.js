import React, { PropTypes, Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { VERSION_NAME } from '../../../constants/Config';
import InputText from '../inputText/InputText';
import MoreMenu from './menu/content/MoreMenu';
import Notification from './menu/content/Notification';
import UserInfo from './menu/content/UserInfo';
import HeaderMenu from './menu/HeaderMenu';
import { setSyncAll } from '../../../apis/user';

class Header extends Component {

  static contextTypes = {
    router: PropTypes.object.isRequired,
    lang: PropTypes.object.isRequired,
    envPlatform: PropTypes.string.isRequired,
  };

  static propTypes = {
    actions: PropTypes.object,
    disable: PropTypes.bool,
    location: PropTypes.object,
    sys: PropTypes.object,
    user: PropTypes.object,
    note: PropTypes.object,
    params: PropTypes.object,
    notification: PropTypes.object,
    dispatch: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.isAddNotifiListener = false;
    this.state = {
      selectedFunction: null,
    };
  }

  componentWillMount() {
    if (!this.props.disable) {
      this.props.actions.notification.refreshNotification();
    }
  }

  componentDidUpdate() {
    if (this.props.disable) return;

    const {
      location: { pathname },
    } = this.props;
    const searchValue = this.refs.searchInput.value();
    if (pathname.match(/^\/search/) && searchValue.length > 0) {
      this.refs.searchInput.clear();
    }
  }

  getIconPosition = (iconInstance) => {
    const { left, right, bottom } = iconInstance.getBoundingClientRect();
    return { left, right, bottom };
  };

  getCusorPosition = (iconInstance) => {
    const { left, bottom, width } = iconInstance.getBoundingClientRect();
    return {
      left: `${left}px`,
      top: `${bottom + 10}px`,
      width: `${width}px`,
    };
  };

  doSearch = () => {
    const searchValue = encodeURI(this.refs.searchInput.value());
    if (searchValue) {
      const path = this.props.location.pathname.split('/')[1];
      if (path === 'search') {
        this.context.router.replace(`/search/${searchValue}`);
      } else {
        this.context.router.push(`/search/${searchValue}`);
      }
      this.props.actions.sys.setGAEvent('MainHeader', 'Search', searchValue);
    }
  };

  addNote = (para, callback) => {
    this.props.actions.note.addNewToNotebookList('note', para, callback);
  };

  handleKeyDown = (e) => {
    switch (e.keyCode) {
      case 13: {
        // enter
        this.doSearch();
        e.preventDefault();
        break;
      }
      default:
        break;
    }
  };

  handleWidowResize = () => {
    /** 用於更新光標位置*/
    this.forceUpdate();
  };

  handleClick = (e) => {
    const {
      location,
      params,
      note,
      user: {
        defaultBook,
        defaultSection,
      },
    } = this.props;

    switch (e.target.className) {
      case 'icon-header-btn_header_notification_normal':
        if (!this.refs.notificationMenu) {
          this.setState({ selectedFunction: 'notification' });
        }
        break;
      case 'icon-header-btn_header_more_normal':
        if (!this.refs.moreMenu) {
          this.setState({ selectedFunction: 'more' });
        }
        break;
      case 'icon-header-ic_header_admin':
      case 'qnote-user-avatar':
      case 'qnote-user-acc':
      case 'icon-header-btn_header_dorpdown_triangle_normal':
        if (!this.refs.userInfoMenu) {
          this.setState({ selectedFunction: 'userInfo' });
        }
        break;
      case 'icon-header-ic_refresh_active':
        setSyncAll();
        break;
      case 'qnote-add-note':
      case 'icon-header-btn_header_addnotes_normal':
      case 'text': {
        const path = location.pathname.split('/')[1];
        const { siteId, sectionId } = params;
        const { nb_id: nbId, share_info: shareInfo } = note.secInfo;
        if (path === 'section' && sectionId && nbId && siteId) {
          if (shareInfo && +shareInfo.permission === 1 && defaultBook && defaultSection) {
            this.addNote({
              secId: defaultSection,
              nbId: defaultBook,
              connId: 'local',
            }, this.context.router.push.bind(this, `/section/local/${defaultSection}`));
          } else {
            this.addNote({
              secId: sectionId,
              nbId,
              connId: siteId,
            });
          }
        } else if (defaultBook && defaultSection) {
          this.addNote({
            secId: defaultSection,
            nbId: defaultBook,
            connId: 'local',
          }, this.context.router.push.bind(this, `/section/local/${defaultSection}`));
        }
        break;
      }
      default:
        break;
    }
  };

  goHome = () => {
    this.context.router.push('/notebook');
  };

  handleBlur = () => {
    this.setState({ selectedFunction: null });
  };

  generateMenu = (menuType) => {
    const { selectedFunction } = this.state;
    const {
      actions: {
        sys: { setWindow },
        user: { getUserInfo, setLang, logout, setTutorial },
      },
      location: { pathname },
      note: { siteTree },
      notification: { message },
      note: { noteInfo, noteList },
      user: { language, languageList, name, email, photo, level, bookNumber, usage, settingUrl, migrate },
      dispatch,
    } = this.props;

    if (selectedFunction !== menuType) return null;

    switch (selectedFunction) {
      case 'more':
        return (
          <MoreMenu
            ref="moreMenu"
            key="moreMenu"
            blurCallback={this.handleBlur}
            setLang={setLang}
            defaultLang={language}
            migrate={migrate}
            langList={languageList}
            getParentPostion={this.getIconPosition.bind(this, this.refs.more)}
            itemCallback={{
              import: () => { setWindow('ImportFirstStep'); },
              export: () => { setWindow('ExportFirstStep'); },
              migrate: () => { setWindow('MigrateNS'); },
              setting: () => { setWindow('Setting'); },
              sync: () => { setWindow('SyncManager'); },
              hybrid: () => { setWindow('HybridConnection'); },
              language: () => {},
              tutorial: () => { setTutorial(1); },
              about: () => { setWindow('About'); },
            }}
          />
        );
      case 'notification':
        return (
          <Notification
            ref="notificationMenu"
            key="notificationMenu"
            blurCallback={this.handleBlur}
            message={message}
            noteInfo={noteInfo}
            siteTree={siteTree}
            pathname={pathname}
            dispatch={dispatch}
            noteList={noteList}
          />
        );
      case 'userInfo':
        return (
          <UserInfo
            ref="userInfoMenu"
            key="userInfoMenu"
            getUserInfo={getUserInfo}
            name={name}
            email={email}
            photo={photo}
            level={level}
            bookNumber={bookNumber}
            usage={usage}
            settingUrl={settingUrl}
            blurCallback={this.handleBlur}
            logout={logout}
          />
        );
      default:
        return null;
    }
  };

  renderMenu = () => {
    const { selectedFunction } = this.state;
    if (!selectedFunction) return null;
    return (
      <HeaderMenu
        className={selectedFunction === 'more' ? 'menu' : selectedFunction}
        id={selectedFunction}
        blurCallback={this.handleBlur}
        getParentPostion={this.getIconPosition.bind(this, this.refs[selectedFunction])}
      >
        {this.generateMenu(selectedFunction)}
      </HeaderMenu>
    );
  };

  renderCursor = () => {
    const { selectedFunction } = this.state;
    if (selectedFunction) {
      window.addEventListener('resize', this.handleWidowResize);
      return <div key="cursor" className="cursor" style={this.getCusorPosition(this.refs[selectedFunction])} />;
    }
    window.removeEventListener('resize', this.handleWidowResize);
    return null;
  };

  renderBadgeNumber = () => {
    if (this.props.notification.count === 0) return null;
    return <div className="notification-badge">{this.props.notification.count}</div>;
  };

  renderFunctionPanel = () => (
    <div>
      {this.renderNav()}
      <ReactCSSTransitionGroup transitionEnterTimeout={200} transitionLeaveTimeout={250} transitionName="showHide">
        {this.renderMenu()}
      </ReactCSSTransitionGroup>
      {this.renderCursor()}
    </div>
  )

  renderNav = () => {
    if (this.props.disable) return null;
    const { lang, envPlatform } = this.context;
    const { avatar, name, isSync } = this.props.user;
    return (
      <div className="qnote-header-nav" onClick={this.handleClick}>
        <div id="search-input" className="search-bar">
          <InputText ref="searchInput" holder={`${lang.input_search_note}..`} search searchFunc={this.doSearch} keydown={this.handleKeyDown} />
        </div>
        <div className="icon-header-ic_header_admin">
          <img role="presentation" className="qnote-user-avatar" src={avatar} />
        </div>
        <div className="qnote-user-acc">{name}</div>
        <div className="icon-header-btn_header_dorpdown_triangle_normal" ref="userInfo" />
        {
          envPlatform === 'nas' ? null : <div className={isSync ? 'icon-header-syncing' : 'icon-header-ic_refresh_active'} title={isSync ? lang.general_syncing : lang.general_sync_all} />
        }
        <div className="notification-container">
          <div className="icon-header-btn_header_notification_normal" ref="notification" title={lang.general_notification} />
          {this.renderBadgeNumber()}
        </div>
        <div className="icon-header-btn_header_more_normal" ref="more" />
        <div className="divide-line">
          <div className="line" />
        </div>
        <div id="qnote-add-note" className="qnote-add-note">
          <div className="icon-header-btn_header_addnotes_normal" />
          <div className="text">{lang.btn_new_note}</div>
        </div>
      </div>
    );
  };

  render() {
    return (
      <div className="qnote-header">
        <div className="qnote-header-logo" onClick={this.goHome}>
          <div className="icon" />
          <div className="title">
            <div className="name">Notes</div>
            <div className="station">{`Station ${VERSION_NAME}`}</div>
          </div>
        </div>
        {this.renderFunctionPanel()}
      </div>
    );
  }
}

export default Header;
