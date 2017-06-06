import React, { Component, PropTypes } from 'react';

export default class UserInfo extends Component {

  static contextTypes = {
    lang: PropTypes.object.isRequired,
    envPlatform: PropTypes.string.isRequired,
  };

  static propTypes = {
    getUserInfo: PropTypes.func.isRequired,
    name: PropTypes.string,
    email: PropTypes.string,
    photo: PropTypes.string,
    level: PropTypes.string,
    bookNumber: PropTypes.shape({
      notebook: PropTypes.string,
      section: PropTypes.string,
      note: PropTypes.string,
    }),
    usage: PropTypes.string,
    settingUrl: PropTypes.string,
    logout: PropTypes.func.isRequired,
  };

  componentWillMount() {
    this.props.getUserInfo();
  }

  transferLevelString = (value) => {
    const level = {
      0: this.context.lang.header_userInfo_level_basic,
      1: this.context.lang.header_userInfo_level_advance,
      2: this.context.lang.header_userInfo_level_pro,
      3: this.context.lang.header_userInfo_level_enterprise,
    };
    return level[value];
  };

  render() {
    const { name, email, photo, level, bookNumber, usage, logout, settingUrl } = this.props;
    const { envPlatform, lang } = this.context;

    return (
      <div>
        <div className="top">
          <div className="photo">
            <img src={photo} role="presentation" />
          </div>
          <div className="info">
            <div className="name" title={name}>{name}</div>
            <div className="text" title={email}>{email}</div>
            { envPlatform !== 'nas' ? <a className="url" href={settingUrl} target="_blank">{lang.header_userInfo_personal_info}</a> : null }
          </div>
        </div>
        <div className="bottom text">
          { envPlatform !== 'nas' ?
            (
            <div>
                      {`Notes Station ${this.transferLevelString(level)} | `}
                      <a href="/billing/" target="_blank">{lang.header_userInfo_upgrade}</a>
            </div>
            ) : null
          }
          <hr />
          <div className="count">
            <div>
              <div className="icon-sidebar-ic_menu_notebook_normal" />
              <div>{`${bookNumber.notebook} ${lang.general_num_of_notebook}`}</div>
            </div>
            <div>
              <div className="icon-sidebar-ic_menu_section_normal" />
              <div>{`${bookNumber.section} ${lang.general_num_of_section}`}</div>
            </div>
            <div>
              <div className="icon-header-ic_account_note" />
              <div>{`${bookNumber.note} ${lang.general_num_of_note}`}</div>
            </div>
          </div>
          <hr />
          { envPlatform !== 'nas' ? <div>{`${lang.header_userInfo_usage} ${usage}`}</div> : null }
          <div className="action">
            <button className="logout" onClick={() => logout()}>{lang.header_userInfo_logout}</button>
          </div>
        </div>
      </div>
		);
  }
}
