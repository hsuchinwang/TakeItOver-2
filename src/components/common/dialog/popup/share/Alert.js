import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import Popup from '../../Popup';

export default class Alert extends Component {

  static contextTypes = {
    lang: PropTypes.object.isRequired,
  };

  renderMessages = (nameList) => {
    const messages = [];
    messages.push(<div className="description" key="share-alert-description">{this.getDescription()}</div>);
    messages.push(
      <div className={classnames('nameList', { more: nameList.length > 10 })} key="share-alert-nameList">
        {nameList.map((name, index) => (<div className="name-item" key={`share-alert-name-${index}`}>{name}</div>))}
      </div>
    );
    return messages;
  };

  render() {
    const { actions, sys: { popPara: { type } } } = this.props;
    const { lang } = this.context;
    return (
          <Popup pop={this.className}
            type="help"
            title={this.title}
            msg={this.renderMessages(this.list)}
            setPopup={actions.sys.setPopup}
            confirm={{
              enable: true,
              text: lang.btn_confirm,
              callback: this.handleConfirm,
            }}
            cancel={{
              enable: true,
              text: lang.btn_cancel,
            }}
          >
          </Popup>
    );
  }
}
