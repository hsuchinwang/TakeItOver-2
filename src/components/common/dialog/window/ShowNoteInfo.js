import React, { Component, PropTypes } from 'react';
import Window from '../Window';

export default class ShowNoteInfo extends Component {

  static contextTypes = {
    lang: PropTypes.object.isRequired,
  };

  static propTypes = {
    actions: PropTypes.shape({
      note: PropTypes.shape({
        getNoteInfo: PropTypes.func.isRequired,
      }),
      sys: PropTypes.shape({
        setWindow: PropTypes.func.isRequired,
      }),
    }),
    note: PropTypes.shape({
      noteInfo: PropTypes.object.isRequired,
    }),
    sys: PropTypes.shape({
      windowPara: PropTypes.shape({
        noteId: PropTypes.string.isRequired,
        connId: PropTypes.string.isRequired,
      }),
    }),
  };

  componentDidMount() {
    const {
      actions: {
        note: {
          getNoteInfo: getNoteInfo,
        },
      },
      sys: {
        windowPara: {
          noteId,
          connId,
        },
      },
    } = this.props;
    getNoteInfo(noteId, connId);
  }

  renderNoteInfoTable = () => {
    const { lang } = this.context;
    const {
      note: { noteInfo },
    } = this.props;
    const tagList = (noteInfo.tagList) ? noteInfo.tagList.join(', ') : '';
    const coauth = (noteInfo.collaborator) ? noteInfo.collaborator.map(value => value.login_id).join(', ') : '';
    const infoData = [
        { name: lang.window_note_info_item_title, content: noteInfo.name },
        { name: lang.window_note_info_item_nb, content: noteInfo.nbName },
        { name: lang.window_note_info_item_sec, content: noteInfo.secName },
        { name: lang.window_note_info_item_tag, content: tagList },
        { name: `${lang.window_note_info_item_create_time}:`, content: noteInfo.createTime },
        { name: lang.window_note_info_item_update_time, content: noteInfo.updateTime },
        { name: lang.window_note_info_item_owner, content: noteInfo.creator },
        { name: lang.window_note_info_item_collaborators, content: coauth },
        { name: lang.window_note_info_item_last_edited_by, content: noteInfo.lastEditor },
    ];
    return (
      <table className="note-info-table">
        <tbody>
          {
            infoData.map((item, index) => (
              <tr key={`noteInfo-row-${index}`}>
                <td>{item.name}</td>
                <td style={{ wordBreak: 'break-all' }}>{item.content}</td>
              </tr>
            ))
          }
        </tbody>
      </table>
    );
  };

  render() {
    const { lang } = this.context;
    const {
      actions: {
        sys: { setWindow },
      },
    } = this.props;
    return (
      <Window type="noteInfo"
        title={lang.window_note_info_title}
        setWindow={ setWindow }
        apply={{
          enable: false,
          text: '',
          callback: null,
        }}
        cancel={{
          enable: true,
          text: lang.btn_close,
          callback: null,
        }}
      >
        {this.renderNoteInfoTable()}
      </Window>
    );
  }
}
