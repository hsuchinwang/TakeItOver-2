import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { routerShape } from 'react-router';
import { bindActionCreators } from 'redux';

import ChatClient from '../common/ChatClient';
import chatClientManagement from '../components/common/ChatClientManager';
import Header from '../components/common/header/index';
import MenuBar from '../components/common/menu/MenuBar';
import MessageContainer from '../components/common/dialog/MessageContainer';
import Utils from '../components/common/Utils';
import * as NoteActions from '../actions/note/index';
import * as SysActions from '../actions/sysActions';
import * as TagActions from '../actions/tagActions';
import * as ShareActions from '../actions/shareActions';
import * as UserActions from '../actions/userActions';
import * as ExportActions from '../actions/exportActions';
import * as ImportActions from '../actions/importActions';
import * as NotificationActions from '../actions/notificationActions';
import * as FilePreviewActions from '../actions/filePreviewActions';
import * as NasActions from '../actions/nasActions';

class NotesApp extends React.Component {

  static contextTypes = {
    router: routerShape.isRequired,
    lang: PropTypes.object.isRequired,
    host: PropTypes.string.isRequired,
    wsPort: PropTypes.number.isRequired,
  };

  static childContextTypes = {
    chatClient: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
  };

  static propTypes = {
    location: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    children: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  getChildContext() {
    return {
      chatClient: {},
      dispatch: this.props.dispatch,
    };
  }

  componentWillMount() {
   // const B = new WS(this.props);
   /* console.log(B.connectToUSDSearchQueue());
    console.log(B.connectToDB());*/
    const {
      location: { pathname },
      actions: {
        user: { getInitialData },
      },
    } = this.props;
    getInitialData(pathname !== undefined ? pathname.split('/')[1] : null);
  }

  render() {
    const childProps = { ...this.props };
    delete childProps.children;

    const { siteList, userId } = this.props.user;
    if (Object.keys(siteList).length < 1 || !userId) return null;
    return (
      <div className="qnote-wrap">
        <Header {...this.props} />
        <div className="qnote-container">
          <MenuBar {...this.props} />
          <div className="qnote-container-right">
            {
              React.Children.map(this.props.children, ele => React.cloneElement(ele, childProps))
            }
          </div>
        </div>
        <Utils {...this.props} />
        <MessageContainer {...this.props} />
      </div>
    );
  }

}

function mapStateToProps(state) {
  return state;
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      note: bindActionCreators(NoteActions, dispatch),
      user: bindActionCreators(UserActions, dispatch),
      sys: bindActionCreators(SysActions, dispatch),
      tag: bindActionCreators(TagActions, dispatch),
      share: bindActionCreators(ShareActions, dispatch),
      notification: bindActionCreators(NotificationActions, dispatch),
      'export': bindActionCreators(ExportActions, dispatch),
      'import': bindActionCreators(ImportActions, dispatch),
      filePreview: bindActionCreators(FilePreviewActions, dispatch),
      nas: bindActionCreators(NasActions, dispatch),
    },
    dispatch,
  };
}

const wsClientManager = chatClientManagement(ChatClient)(NotesApp);
export default connect(mapStateToProps, mapDispatchToProps)(wsClientManager);
