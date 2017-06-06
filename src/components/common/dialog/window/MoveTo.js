import React, { Component, PropTypes } from 'react';
import Window from '../Window';
import DropDownMenu from '../../dropdown/DropDownMenu';

export default class MoveTo extends Component {
  static contextTypes = {
    lang: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
  }

  static propTypes = {
    note: PropTypes.shape({
      moveToList: PropTypes.shape({
        siteList: PropTypes.array.isRequired,
        nbList: PropTypes.array.isRequired,
        secList: PropTypes.array.isRequired,
      }),
    }),
    sys: PropTypes.shape({
      windowPara: PropTypes.shape({
        connId: PropTypes.string.isRequired,
        nbId: PropTypes.string.isRequired,
        secId: PropTypes.string.isRequired,
        noteId: PropTypes.string,
        type: PropTypes.string.isRequired,
      }),
    }),
    actions: PropTypes.shape({
      sys: PropTypes.shape({
        setWindow: PropTypes.func.isRequired,
      }),
      note: PropTypes.shape({
        initMoveTo: PropTypes.func.isRequired,
        getNotebookListForMoveTo: PropTypes.func.isRequired,
        getSectionListForMoveTo: PropTypes.func.isRequired,
        setMoveToNoteBook: PropTypes.func.isRequired,
        setMoveToSection: PropTypes.func.isRequired,
      }),
    }),
  };

  constructor(props) {
    super(props);
    this.state = {
      siteSelected: 0,
      nbSelected: 0,
      secSelected: 0,
      stateMsg: null,
    };
  }

  renderNoteBook = () => {
    const {
      note: { moveToList: { nbList } },
    } = this.props;

    if (nbList.length === 0) return null;

    const menus = nbList.map(item => ({ name: item.nb_name }));

    menus.unshift({
      name: `--${this.context.lang.dropdown_select_notebook}--`,
    });

    return (
      <div className="row">
        <span className="row-title">{ `${this.context.lang.general_notebook} :` }</span>
        <DropDownMenu key="move-nb" menus={menus} onchange={this.handleNoteBookChange} normal />
      </div>
    );
  };

  renderSection = () => {
    const {
      note: { moveToList: { secList } },
      sys: { windowPara },
    } = this.props;

    if (this.state.nbSelected === 0 || windowPara.type === 'section' || !secList) return null;

    const menus = secList.map((item) => ({ name: item.sec_name }));

    menus.unshift({ name: `--${this.context.lang.dropdown_select_section}--` });

    return (
      <div className="row">
        <span className="row-title">{ `${this.context.lang.general_section} :` }</span>
        <DropDownMenu key="move-sec" ref="DropDownMoveSec" menus={menus} onchange={this.handleSectionChange} normal />
      </div>
    );
  };

  renderMsg = () => {
    if (this.state.stateMsg) {
      return (
        <div className="qnote-dialog-error-msg">{ this.state.stateMsg }</div>
      );
    }
    return null;
  };

  handleNoteBookChange = (index) => {
    this.setState({ nbSelected: index, secSelected: 0, stateMsg: null });
  };

  handleSectionChange = (index) => {
    this.setState({ secSelected: index });
  };

  handleSubmit = () => {
    const {
      note: { moveToList: { nbList, secList } },
      sys: { windowPara },
      actions: {
        sys: { setWindow },
        note: { setMoveToNoteBook, setMoveToSection },
      },
    } = this.props;
    const { lang } = this.context;

    switch (windowPara.type) {
      case 'section':
        if (this.state.nbSelected === 0) {
          this.setState({ stateMsg: lang.window_move_to_check_selected_notebook });
        } else if (this.state.nbSelected > 0 && nbList[this.state.nbSelected - 1].nb_id === windowPara.nbId) {
          this.setState({ stateMsg: lang.window_move_to_same_notebook });
        } else {
          if (nbList.length > 0) setMoveToNoteBook(windowPara, nbList[this.state.nbSelected - 1].nb_id);
          setWindow(null);
        }
        break;
      case 'note':
        if (this.state.nbSelected === 0) {
          this.setState({ stateMsg: lang.window_move_to_check_selected_notebook });
        } else if (this.state.secSelected === 0) {
          this.setState({ stateMsg: lang.window_move_to_check_selected_section });
        } else if (this.state.secSelected > 0 && secList[this.state.secSelected - 1].sec_id === windowPara.secId) {
          this.setState({ stateMsg: lang.window_move_to_same_section });
        } else {
          if (nbList.length > 0 && secList.length > 0) setMoveToSection(windowPara, nbList[this.state.nbSelected - 1].nb_id, secList[this.state.secSelected - 1].sec_id, this.moveNoteSuccFunc);
          setWindow(null);
        }
        break;
      default:
    }
  };

  moveNoteSuccFunc = () => {
    const {
      note: { moveToList: { secList } },
      sys: { windowPara },
    } = this.props;
    this.context.router.replace(`/section/${windowPara.connId}/${secList[this.state.secSelected - 1].sec_id}/${windowPara.noteId}`);
  };

  componentWillMount() {
    const {
      sys: {
        windowPara, // connId, nbId, secId, noteId, type
      },
      actions: {
        note: { getNotebookListForMoveTo },
      },
    } = this.props;

    getNotebookListForMoveTo(windowPara);
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      sys: { windowPara },
      note: {
        moveToList: { nbList },
      },
      actions: {
        note: { getSectionListForMoveTo },
      },
    } = this.props;

    if (windowPara.type === 'note' && this.state.nbSelected > 0 && this.state.nbSelected !== prevState.nbSelected) {
      getSectionListForMoveTo({ connId: windowPara.connId, id: nbList[this.state.nbSelected - 1].nb_id });
      if ('DropDownMoveSec' in this.refs) this.refs.DropDownMoveSec.setSelected();
    }
  }

  componentWillUnmount() {
    this.props.actions.note.initMoveTo();
  }

  render() {
    const {
      actions: {
        sys: { setWindow },
      },
    } = this.props;
    const { lang } = this.context;

    return (
      <Window type="moveTo"
        title={lang.general_move_to}
        setWindow={setWindow}
        apply={{
          enable: true,
          text: lang.btn_confirm,
          callback: () => {
            this.handleSubmit();
          },
        }}
        cancel={{
          enable: true,
          text: lang.btn_cancel,
          callback: () => {},
        }}>
        { this.renderNoteBook() }
        { this.renderSection() }
        { this.renderMsg() }
      </Window>
    );
  }
}
