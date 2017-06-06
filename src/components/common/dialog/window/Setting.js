import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Window from '../Window';

export default class Setting extends Component {

  static contextTypes = {
    lang: PropTypes.object.isRequired,
    envPlatform: PropTypes.string.isRequired,
  };

  static propTypes = {
    actions: PropTypes.shape({
      sys: PropTypes.shape({
        setWindow: PropTypes.func.isRequired,
      }),
    }),
    user: PropTypes.shape({
      announce: PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
      subscribe: PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
    }),
  };

  render() {
    const { lang, envPlatform } = this.context;
    const {
      actions: {
        sys: { setWindow },
        user: { setMailSubscribe },
      },
      user: { email, announce, subscribe, googleAnalytics: ga },
    } = this.props;

    return (
      <Window
        type="setting"
        title={lang.window_setting_title}
        setWindow={setWindow}
        apply={{
          enable: true,
          text: lang.btn_apply,
          callback: () => {
            const { systemNotify, cooperateNotify, gaAgree } = this.refs;
            const params = {
              unsend_user: email,
              google_analytics: gaAgree.checked ? 1 : 0,
            };
            if (systemNotify) params.subscribe = systemNotify.checked ? 1 : 0;
            if (cooperateNotify) params.announce = cooperateNotify.checked ? 1 : 0;

            setMailSubscribe(params);
            setWindow(null);
          },
        }}
        cancel={{
          enable: true,
          text: lang.btn_cancel,
        }}
      >
        <div>
          {
            envPlatform !== 'nas' ? (
              <div className="subscribe-field">
                <div className="title">{lang.window_setting_subscribe_title}</div>
                <div className="row">
                  <input id="systemNotify" type="checkbox" ref="systemNotify" defaultChecked={(+subscribe === 1)} />
                  <label className="label" htmlFor="systemNotify">{lang.window_setting_subscribe_system}</label>
                </div>
                <div className="row">
                  <input id="cooperateNotify" type="checkbox" ref="cooperateNotify" defaultChecked={(+announce === 1)} />
                  <label className="label" htmlFor="cooperateNotify">{lang.window_setting_subscribe_coordinate}</label>
                </div>
              </div>
            ) : null
          }
          {
            envPlatform !== 'nas' ? <hr /> : null
          }
          <div className="ga-field">
            <div className="row">
              <input id="gaAgree" type="checkbox" ref="gaAgree" defaultChecked={(+ga === 1)} />
              <label className="label" htmlFor="gaAgree">{lang.window_setting_google_analytics}</label>
            </div>
          </div>
        </div>
      </Window>
    );
  }
}
