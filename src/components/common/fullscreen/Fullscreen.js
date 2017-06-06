import React, { Component, PropTypes } from 'react';
import screenfull from 'screenfull';
import Header from '../header/index';
import EncryptPage from '../../note/editor/EncryptPage';
import Editor from '../../note/editor/Editor';
import { converNoteContent, connIdNormaliz, getBaseUrl } from '../../../common/Utils';

export default class Fullscreen extends Component {
  static propTypes = {
    note: PropTypes.shape({
      fullscreenModeButtons: PropTypes.shape({
        prev: PropTypes.bool,
        next: PropTypes.bool
      }),
      noteInfo: PropTypes.shape({
        name: PropTypes.string,
        content: PropTypes.string,
        realNoteId: PropTypes.string
      }),
      noteList: PropTypes.object
    }),
    actions: PropTypes.shape({
      note: PropTypes.shape({
        showPrevConent: PropTypes.func,
        showNextConent: PropTypes.func,
        toggleFullscreenMode: PropTypes.func,
        unLockEncryptNote: PropTypes.func
      })
    }),
    user: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.slowChangeNoteHandler = null;
  }

  componentWillUnmount() {
    document.removeEventListener(screenfull.raw.fullscreenchange, this.handleFullscreenChange);
  }

  componentDidMount() {
    const fullscreen = this.refs.fullscreen;
    if (screenfull.enabled) screenfull.request(fullscreen);
    document.addEventListener(screenfull.raw.fullscreenchange, this.handleFullscreenChange);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { content: nextContent, realNoteId: nextRealNoteId } = nextProps.note.noteInfo;
    const { content, realNoteId } = this.props.note.noteInfo;
    if ((nextRealNoteId !== realNoteId) ||
        (nextContent !== content && nextRealNoteId == realNoteId)) {
      this.focusFullscreen();
      return true;
    }
    return false;
  }

  handleClick = (event) => {
    switch (event.target.className) {
      case 'prev':
        this.changeNoteContent(false);
        break;
      case 'next':
        this.changeNoteContent(true);
        break;
    }
  };

  handleFullscreenChange = () => {
    if (!screenfull.isFullscreen) this.props.actions.note.toggleFullscreenMode();
    else this.focusFullscreen();
  };

  focusFullscreen = () => {
    this.refs.fullscreen.focus();
  };

  handleKeyUp = (event) => {
    /* 檢查是否focus在輸入框*/
    if (document.activeElement.type !== 'password') {
      switch (event.keyCode) {
        case 37:
          this.changeNoteContent(false);
          break;
        case 39:
          this.changeNoteContent(true);
          break;
      }
    }
  };

  changeNoteContent(isNext = false) {
    if (this.slowChangeNoteHandler) {
      clearTimeout(this.slowChangeNoteHandler);
      this.slowChangeNoteHandler = null;
    }
    this.slowChangeNoteHandler = setTimeout(() => {
      if (isNext) this.next();
      else this.prev();
    }, 200);
  }

  prev = () => {
    const { actions, note } = this.props;
    if (note.fullscreenModeButtons.prev) {
      actions.note.showPrevConent();
    }
  };

  next = () => {
    const { actions, note } = this.props;
    if (note.fullscreenModeButtons.next) {
      actions.note.showNextConent();
    }
  };

  renderContent = () => {
    const {
      note: { noteInfo },
      user: { siteList },
      user: userInfo,
      actions,
      chatClients,
    } = this.props;
    const { id, connId } = noteInfo;
    const connectId = connIdNormaliz(connId);
    const baseUrl = `${getBaseUrl(connId, siteList)}/ns/api/v2/note/${connectId}`;
    const noteContent = converNoteContent(noteInfo, baseUrl);
    if (noteContent == null) {
      return (
        <div className="content encrypt">
          <EncryptPage key={`encryptPage-${id}-${connId}`} noteId={id} connId={connId} unLock={actions.note.unLockEncryptNote} />
        </div>
      );
    }
    return (
      <div className="content">
        <Editor
          userInfo={userInfo}
          noteInfo={noteInfo}
          chatClient={chatClients[noteInfo.connId].instance}
          wsState={chatClients[noteInfo.connId].state}
          readOnly
          fullScreen
          ref="editorContainer"
          key="fullscreenMod"
        />
      </div>
    );
  };

  render() {
    const { note: { fullscreenModeButtons: { prev, next }, noteInfo } } = this.props;
    return (
      <div className="fullscreen" ref="fullscreen" tabIndex={-1} onKeyUp={this.handleKeyUp}>
        <Header className="header" disable />
        <div className="note-title">{noteInfo.name}</div>
        {prev ? <div className="prev icon-preview-btn_present_previous_normal" onClick={this.changeNoteContent.bind(this, false)} /> : null}
        {next ? <div className="next icon-preview-btn_present_next_normal" onClick={this.changeNoteContent.bind(this, true)} /> : null}
        {this.renderContent()}
      </div>
    );
  }
}
