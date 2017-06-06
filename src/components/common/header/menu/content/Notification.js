import React, { PropTypes } from 'react';

import { setRefresh, setPopup } from '../../../../../actions/sysActions';
import { setSelectedTreeItem } from '../../../../../actions/note/index';
import { getNoteInfo } from '../../../../../actions/note/noteActions';
import { cleanNotification, refreshNotification,
         readNotificationMessage, changeNotificationMenuState } from '../../../../../actions/notificationActions';

export default class Notification extends React.Component {

  static contextTypes = {
    router: PropTypes.object.isRequired,
    lang: PropTypes.object.isRequired,
  };

  static propTypes = {
    message: PropTypes.array.isRequired,
    blurCallback: PropTypes.func.isRequired,
    siteTree: PropTypes.object.isRequired,
    pathname: PropTypes.string.isRequired,
    noteInfo: PropTypes.object.isRequired,
    noteList: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(refreshNotification());
    dispatch(changeNotificationMenuState(true));
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(readNotificationMessage());
    dispatch(changeNotificationMenuState(false));
  }

  itemHoverHandler = (e) => {
    let className = e.target.className;
    const btnSets = ['btn_close_normal', 'pause_normal', 'play_normal', 'stop_normal'];
    const replaceSets = ['btn_close_over', 'pause_over', 'play_over', 'stop_over'];
    for (let i = 0; i < btnSets.length; i++) {
      if (className.indexOf(btnSets[i]) >= 0) {
        className = className.replace(btnSets[i], replaceSets[i]);
        e.target.className = className;
        return;
      }
    }
  };

  itemBlurHandler = (e) => {
    let className = e.target.className;
    const btnSets = ['btn_close_over', 'pause_over', 'play_over', 'stop_over'];
    const replaceSets = ['btn_close_normal', 'pause_normal', 'play_normal', 'stop_normal'];
    for (let i = 0; i < btnSets.length; i++) {
      if (className.indexOf(btnSets[i]) >= 0) {
        className = className.replace(btnSets[i], replaceSets[i]);
        e.target.className = className;
        return;
      }
    }
  };

  itemKeyDownHandler = (e) => {
    let className = e.target.className;
    const btnSets = ['btn_close_over', 'pause_over', 'play_over', 'stop_over'];
    const replaceSets = ['btn_close_press', 'pause_normal_press', 'play_normal_press', 'stop_normal_press'];
    for (let i = 0; i < btnSets.length; i++) {
      if (className.indexOf(btnSets[i]) >= 0) {
        className = className.replace(btnSets[i], replaceSets[i]);
        e.target.className = className;
        return;
      }
    }
  };

  itemKeyUpHandler = (e) => {
    let className = e.target.className;
    const btnSets = ['btn_close_press', 'pause_normal_press', 'play_normal_press', 'stop_normal_press'];
    const replaceSets = ['btn_close_normal', 'pause_normal', 'play_normal', 'stop_normal'];
    for (let i = 0; i < btnSets.length; i++) {
      if (className.indexOf(btnSets[i]) >= 0) {
        className = className.replace(btnSets[i], replaceSets[i]);
        e.target.className = className;
        return;
      }
    }
  };

  doAction = (action) => {
    const { method, target, target_type: targetType } = action;
    const {
      noteInfo: { isUploading },
      noteList,
      siteTree,
      blurCallback,
      pathname,
      dispatch,
    } = this.props;
    switch (method) {
      case 'download':
        window.open(target.url, '_blank');
        break;
      case 'goto':
        if (isUploading) {
          dispatch(setPopup('CommonPop', {
            typeIcon: 'warning',
            title: this.context.lang.general_warring,
            msg: this.context.lang.message_unloadtab_upload_not_over,
            confirmOnly: true,
          }));
          break;
        }

        dispatch(setRefresh());
        if (targetType === 'notebook') {
          if (pathname !== '/notebook') {
            this.context.router.push('/notebook');
          }
          dispatch(setSelectedTreeItem({ connId: 'local', id: target.nb_id, type: targetType }));
        } else if (targetType === 'section') {
          // if (pathname.indexOf('section') === -1) {
          //   this.context.router.push(`/section/local/${target.sec_id}`);
          // } else {
          //   dispatch(setRefresh('section', {
          //     sectionId: target.sec_id,
          //     siteId: -1,
          //   }));
          // }
          window.location.href = `/ns/section/local/${target.sec_id}`;
        } else if (targetType === 'note') {
          // dispatch(getNoteInfo(target.note_id, 'local'));
          // if (noteList.order.indexOf(target.note_id) === -1) {
          //   dispatch(setRefresh('section', {
          //     sectionId: target.sec_id,
          //     siteId: -1,
          //   }));
          // }
          // this.context.router.push(`/section/local/${target.sec_id}/${target.note_id}`);
          // change below for avoiding bug of note switch loop
          window.location.href = `/ns/section/local/${target.sec_id}/${target.note_id}`;
        }
        break;
      default:
        break;
    }
    blurCallback();
  };

  getNotifiContent(type, value) {
    let title;
    let msg;
    let icon;
    let args = null;
    const { lang } = this.context;
    switch (+type) {
      case 70002:
        icon = 'icon-header-notification-ic_notification_import';
        title = lang.share_import_title;
        msg = lang.share_import_success_message.slice();
        args = ['name'];
        break;
      case 70003:
        icon = 'icon-header-notification-ic_notification_export';
        title = lang.share_export_title;
        msg = lang.share_export_success_message.slice();
        args = ['name'];
        break;
      case 70004:
        icon = 'icon-header-notification-ic_notification_import_fail';
        title = lang.share_import_title;
        msg = lang.share_import_fail_message.slice();
        args = ['name'];
        break;
      case 70005:
        icon = 'icon-header-notification-ic_notification_export_fail';
        title = lang.share_export_title;
        msg = lang.share_export_fail_message.slice();
        args = ['name'];
        break;
      case 70019:
        icon = 'icon-header-notification-ic_notification_share-to-me';
        title = lang.share_share_note_title;
        msg = lang.share_share_message.slice();
        args = ['email', 'name'];
        break;
      case 70014:
        icon = 'icon-header-notification-ic_notification_share-to-me';
        title = lang.share_share_section_title;
        msg = lang.share_share_message.slice();
        args = ['email', 'name'];
        break;
      case 70006:
        icon = 'icon-header-notification-ic_notification_share-to-me';
        title = lang.share_share_notebook_title;
        msg = lang.share_share_message.slice();
        args = ['email', 'name'];
        break;
      case 70010:
        icon = 'icon-header-notification-ic_notification_stop-sharing';
        title = lang.share_stop_share_title;
        msg = lang.share_stop_share_message.slice();
        args = ['email', 'name'];
        break;
      case 70011:
        icon = 'icon-header-notification-ic_notification_content-removed';
        title = lang.share_delete_share_section_title;
        msg = lang.share_delete_share_message.slice();
        args = ['email', 'name'];
        break;
      case 70013:
        icon = 'icon-header-notification-ic_notification_content-removed';
        title = lang.share_delete_share_note_title;
        msg = lang.share_delete_share_message.slice();
        args = ['email', 'name'];
        break;
      default:
        break;
    }
    if (args) {
      for (let i = 0; i < args.length; i++) {
        msg = msg.replace(`$${i+1}`, value[args[i]]);
      }
    }
    return { icon, title, msg };
  }

  renderMsgItem = () => {
    const { message } = this.props;
    if (message.length === 0) {
      return (
        <div className="notification-empty-item">
          <div className="icon-header-notification-no_info empty-icon"></div>
          <div>No Notification</div>
        </div>
      );
    }

    return message.map((value, index) => {
      const parameters = JSON.parse(value.message);
      const action = JSON.parse(value.action);
      const { icon, title, msg } = this.getNotifiContent(value.msg_type, parameters);
      return (
        <li className="notification-item" key={index} title={msg}>
          <div className="notification-item-content" onClick={() => this.doAction(action)}>
            <div className={`${icon} task-icon`} />
            <div className="description-container">
              <div className="title">{title}</div>
              <div className="subinfo">{msg}</div>
            </div>
          </div>
          {
          // <div className='notification-item-btn-container'>
          //     <div className='notification-item-btn icon-header-notification-btn_close_normal'
          //         onMouseEnter={this.itemHoverHandler}
          //         onMouseLeave={this.itemBlurHandler}
          //         onMouseDown={this.itemKeyDownHandler}
          //         onMouseDown={this.itemKeyYpHandler}></div>
          // </div>
          }
        </li>
      );
    });
  };

  renderCleanBtn = () => {
    const { dispatch, message } = this.props;
    if (message.length === 0) return null;
    return (
      <div className="notification-btn-container">
        <button onClick={() => dispatch(cleanNotification())}>Clear All</button>
      </div>
    );
  };

  render() {
    return (
      <div>
        <div className="notification-header">
          <span>Notification</span>
        </div>
        <ul className="notification-items">
            {this.renderMsgItem()}
        </ul>
        {this.renderCleanBtn()}
      </div>
    );
  }

}
