import React, { Component, PropTypes } from 'react';
import Window from '../Window';
import LabelForm from '../../label/LabelForm';

export default  class AddTag extends Component {

  static contextTypes = {
    lang: PropTypes.object.isRequired,
  };

  static propTypes = {
    actions: PropTypes.shape({
      note: PropTypes.shape({
        getRecentUseTagList: PropTypes.func.isRequired,
        getTagListByNoteFromDB: PropTypes.func.isRequired,
        saveTagListByNoteId: PropTypes.func.isRequired,
      }),
      sys: PropTypes.shape({
        setWindow: PropTypes.func.isRequired,
      }),
    }),
    note: PropTypes.shape({
      tagList: PropTypes.array.isRequired,
      recentUseTagList: PropTypes.array.isRequired,
    }),
    sys: PropTypes.shape({
      windowPara: PropTypes.shape({
        noteId: PropTypes.string.isRequired,
        connId: PropTypes.string.isRequired,
      }),
    }),
    params: PropTypes.object.isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
    }),
  };

  componentWillMount() {
    const {
      sys: {
        windowPara: { noteId, connId },
      },
      actions: {
        note: { getTagListByNoteFromDB, getRecentUseTagList },
      },
    } = this.props;

    getTagListByNoteFromDB(noteId, connId);
    getRecentUseTagList();
  }

  inputRecentTag = tagName => {
    const tagList = this.refs.labelForm.getList();
    if (tagList.indexOf(tagName) === -1) {
      this.refs.labelForm.pushList(tagName);
    }
  };

  renderRecetntTag = () => {
    if (this.props.note.recentUseTagList.length === 0) return null;
    return (
      <div className="recent-tag">
        <div>{this.context.lang.window_tag_recently_used}</div>
        <div className="recent-tag-container">
          {this.props.note.recentUseTagList.map((tagName, index) => {
            return (
              <div className="tag" key={`recent-tag-${index}`} title={tagName} onClick={() => this.inputRecentTag(tagName)}>
                <div className="text">{tagName}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  render() {
    const { lang } = this.context;
    const {
      note: {
        secInfo: { sec_name: secName },
        noteInfo: { tagList },
      },
      location: { pathname },
      params: { tagId },
      actions: {
        sys: { setWindow },
        note: { saveTagListByNoteId },
      },
      sys,
    } = this.props;

    return (
      <Window
        type="addTag"
        title={lang.window_tag_title}
        setWindow={setWindow}
        apply={{
          enable: true,
          text: lang.btn_save,
          callback: () => {
            setWindow(null);
             const runnable = async () => {
                await saveTagListByNoteId(
                  sys.windowPara,
                  this.refs.labelForm.getList(),
                  (pathname.split('/')[1] === 'tagNote' && secName && this.refs.labelForm.getList().indexOf(secName) < 0) ? tagId : null,
                  (pathname.split('/')[1] === 'tag')
                );
                this.props.chatClients.local.instance.sendUpatedNoteTags(this.props.note.noteInfo.connId, this.props.note.noteInfo.realNoteId);
             }
            runnable();
          },
        }}
        cancel={{
          enable: true,
          text: lang.btn_cancel,
          callback: () => {},
        }}
      >
        <LabelForm
          ref="labelForm"
          labels={tagList}
          limit={100}
          tagParser
          placeholder={lang.window_tag_placeholder_add_tag}
        />
        {this.renderRecetntTag()}
      </Window>
    );
  }
}

