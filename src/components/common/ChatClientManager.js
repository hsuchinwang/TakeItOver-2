import React, { createElement, PropTypes } from 'react';

import { setPopup, setRefresh } from '../../actions/sysActions';
import { getTagListByNoteFromDB } from '../../actions/note/noteActions';
import * as ChatActionTypes from '../../constants/Chat';

const nas_ws_port = '7081';
const nas_ws_path = '/socket.io';

function getComponentName(component) {
  const componentName = component.displayName || component.name || 'Component';
  return `${componentName}WSCleintsManager`;
}

export default function chatClientManagement(ChatClient) {
  return WrappedComponent => {
    //WrappedComponent = NoteApp
    class ChatClientManager extends React.Component {

      static propTypes = {
        note: PropTypes.object.isRequired,
        user: PropTypes.object.isRequired,
        sys: PropTypes.object.isRequired,
        actions: PropTypes.object.isRequired,
      };

      constructor(props, context) {
        super(props, context);
        this.loadingMaskStr = 'chatClient';
        this.state = {
          chatClients: {},
        };
      }

      componentWillMount() {
        if (!this.state.local) {
          let path = null;
          let host = window._dn;
          if (window._envPlatform === 'nas') {
            host = `//${host}:${nas_ws_port}`;
            path = `${nas_ws_path}`;
          } else {
            host = `//${host}:8081`;
          }
          this.connectToWebsocketServer('local', host, undefined, undefined, path);
        }
      }

      componentDidUpdate(prevProps) {
        const {
          note: { noteInfo: prevNoteInfo },
          user: { siteList: prevSiteList },
        } = prevProps;
        const {
          note: { noteInfo },
          user: { siteList },
        } = this.props;
        const { chatClients } = this.state;
        const { connId } = noteInfo;

        if ((siteList !== prevSiteList || noteInfo !== prevNoteInfo) && connId) {
          if (this.isNeedNewConnection(connId, chatClients, siteList)) {
            const siteInfo = siteList[connId];
            const connOptions = this.getConnectionOptions(siteInfo);
            if (siteInfo.user_site === 'NAS') {
              if (siteInfo.type === 'NAS') {
                if (window.location.host.indexOf(siteInfo.host) > -1) {
                  this.connectToWebsocketServer(connId, `//${window._dn}}:${nas_ws_port}`, siteInfo.mount_userid, siteInfo.connectionid, nas_ws_path);
                } else {
                  this.connectToWebsocketServer(connId, `//${window._dn}}:${nas_ws_port}`, undefined, undefined, nas_ws_path);
                }
              } else {
                this.connectToWebsocketServer(connId, ...connOptions);
              }
            } else {
              if (siteInfo.type === 'NAS') {
                this.connectToWebsocketServer(connId, `//${window._dn}}:${nas_ws_port}`, undefined, undefined, null);
              } else {
                this.connectToWebsocketServer(connId, ...connOptions);
              }
            }
          }
          this.removeConn(connId);
        }
      }

      setConnectionState(connId, client, state) {
        const {
          sys: {
            loadingMask,
            popPara,
          },
          actions: {
            sys: { toggleLoadingMask },
          },
          dispatch,
        } = this.props;
        const indexInLoadingMask = loadingMask.indexOf(this.loadingMaskStr);

        if (state === -1 && indexInLoadingMask === -1) {
          dispatch(setPopup('CommonPop', {
            typeIcon: 'warning',
            title: window.lang_dictionary.window_socket_disconnect_title,
            msg: window.lang_dictionary.window_socket_disconnect_refresh,
            confirmBtnText: window.lang_dictionary.btn_refresh,
            confirmOnly: true,
            confirmCallback: () => {
              window.location.href = '/ns/';
            },
            wsDisconnect: true,
          }));
        } else if (state === 1 && indexInLoadingMask !== -1) {
          toggleLoadingMask(this.loadingMaskStr);
        }
        if (state === 1 && popPara && popPara.wsDisconnect) {
          dispatch(setPopup(null));
        }
        this.setState({
          chatClients: {
            ...this.state.chatClients,
            [connId]: {
              instance: client,
              state,
            },
          },
        });
      }

      getConnectionOptions(siteOptions) {
        const {
          port,
          type,
          user_site: userType,
          mount_userid: mountUserId,
          connectionid: token,
        } = siteOptions;

        let path = null;
        let host = siteOptions.host;
        if (!host) throw new Error('site list error');
        if (type === 'Default') {
          if (userType === 'NAS') host = `//${host}:${nas_ws_port}`;
          else host = `//${host}:8081`;
        } else if (type === 'NAS') {
          host = `https://${host}:${nas_ws_port}`;
          path = nas_ws_path;
        } else {
          if (userType === 'NAS') host = `https://${host}:${nas_ws_port}`;
          else host = `//${host}:8081`;
        }

        return [
          host,
          mountUserId,
          token,
          path,
        ];
      }

      isNeedNewConnection(connId, conns, siteList) {
        return !conns[connId] && siteList[connId] && siteList[connId].type !== 'Default';
      }

      changeNotePermission = request => {

        const {
          note: {
            noteInfo: { realNoteId, nbId, secId, shareInfo },
          },
          actions: {
            sys: { setPopup },
            note: { setNoteInfo },
          dispatch,
          },
        } = this.props;
        if (request.action === ChatActionTypes.EDITOR_CHANGE_MODE) {
          const {
            nbId: changeNbId,
            secId: changeSecId,
            noteId,
          } = request.payload;
          const permission = +request.payload.permission;
          if (nbId !== changeNbId && secId !== changeSecId && noteId !== realNoteId) return;

          const popupOptions = {
            typeIcon: 'warning',
            title: window.lang_dictionary.window_share_permission_type_change_title,
            msg: window.lang_dictionary.window_share_permission_type_change_content,
            confirmOnly: true,
          };
          if (permission < 1) {
            popupOptions.confirmCallback = () => { window.location.reload(); };
          } else if (permission >= 1 && permission <= 3) {
            setNoteInfo({
              shareInfo: {
                ...shareInfo,
                permission,
              },
            });
          }
          setPopup('CommonPop', popupOptions);
        }
      }

      recvNotification = response => {
        this.props.actions.notification.addNotificationMsg(response);
      };

      recvSyncNotification = response => {
        const {
          params: { siteId, sectionId },
          location,
        } = this.props;
        const path = location.pathname.split('/')[1];

        switch (response.action) {
          case ChatActionTypes.EDITOR_SYNC:
            this.props.actions.user.updateUserInfo({ isSync: !response.payload.isFinish });
            if (response.payload.isFinish) {
              this.props.dispatch(setRefresh());
              if (path === 'section' && sectionId) {
                this.props.dispatch(setRefresh('section', {
                  sectionId,
                  siteId: siteId === 'local' ? -1 : siteId,
                }));
              }
            }
            break;
          default:
            break;
        }
      }

      TagListener = msg => {
        setTimeout(() => {
          this.props.dispatch(getTagListByNoteFromDB(msg.realNoteId, msg.connId));
        }, 2000);
      }

      connectToWebsocketServer(connId, url, userId, token, path) {
        const conn = new ChatClient(url, userId, token, path);
        conn.addListener('open', this.setConnectionState.bind(this, connId, conn, 1));
        conn.addListener('error', this.setConnectionState.bind(this, connId, conn, -1));
        conn.addListener('close', this.setConnectionState.bind(this, connId, conn, -1));
        conn.addListener('note', this.changeNotePermission);
       // conn.addListener('tag', this.TagListener);
        if (connId === 'local') {
          conn.addListener('notification', this.recvNotification);
          conn.addListener('sync_notifi', this.recvSyncNotification);
          conn.addListener('tag', this.TagListener);
        }
        this.setState({
          [connId]: { instance: conn, state: 0 },
        });
        return conn;
      }

      removeConn(connId) {
        const result = { ...this.state.chatClients };
        const connIds = Object.keys(result);
        connIds.forEach(connName => {
          if (connName !== connId && connName !== 'local') {
            result[connName].instance.clearListener();
            delete result[connName];
          }
        });
        this.setState({ chatClients: result });
      }

      render() {
        return createElement(WrappedComponent, {
          ...this.props,
          chatClients: this.state.chatClients,
        });
      }

    }

    ChatClientManager.displayName = getComponentName(WrappedComponent);
    ChatClientManager.WrappedComponent = WrappedComponent;

    return ChatClientManager;
  };
}
