import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';

export default class ExportPrototype extends Component {
  static propTypes = {
    className: PropTypes.string.isRequired,
    notebookList: PropTypes.object,
    getNotebookList: PropTypes.func.isRequired,
    setWindowErrorMessage: PropTypes.func.isRequired,
    notebookListFocusEvent: PropTypes.func,
    radioButtons: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
    })).isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      isSelected: props.radioButtons[0].id,
      notebookList: props.notebookList,
    };
    props.getNotebookList();
  }

  componentDidMount() {
    this.props.setWindowErrorMessage(null);
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.notebookList !== this.props.notebookList) {
      this.setState({ notebookList: nextProps.notebookList });
    }
    return true;
  }

  handleRadioChanged = (id) => {
    this.props.setWindowErrorMessage(null);
    this.setState({ isSelected: id });
  };

  handleCheckBoxChecked = (id) => {
    const { notebookList } = this.state;
    notebookList[id].checked = !notebookList[id].checked;
    this.setState({ notebookList });
  };

  renderRadioButtons = () => {
    const { isSelected } = this.state;
    return this.props.radioButtons.map((item, index) => (
        <div key={`export-radio-${index}`} className="custom-radio" onClick={this.handleRadioChanged.bind(this, item.id)}>
          <div className={classnames('qnote-input-radio', { active: isSelected === item.id })} />
          <div>{item.title}</div>
        </div>
    ));
  };

  renderNotebookList = () => {
    const { notebookList, isSelected } = this.state;

    if (isSelected === 'my') return null;
    return Object.keys(notebookList).map((key, index) => {
      const { title, checked } = notebookList[key];
      return (
        <div key={`export-notebook-${index}`} className="custom-checkbox" onClick={this.handleCheckBoxChecked.bind(this, key)}>
          <div className={classnames('qnote-input-checkbox', { active: checked })} />
          <div className="content">{title}</div>
        </div>
      );
    });
  };

  getSelectedRadio = () => this.state.isSelected;

  getCheckedBooks = () => {
    const { notebookList } = this.state;
    return Object.keys(notebookList).filter(key => (notebookList[key].checked === true)).join(',');
  };

  render() {
    const { notebookListFocusEvent } = this.props;
    return (
      <div className={this.props.className}>
        <div className="radioPanel">
          {this.renderRadioButtons()}
        </div>
        <div className="notebookList" onFocus={notebookListFocusEvent ? notebookListFocusEvent.bind(this) : null} tabIndex={-1}>
          {this.renderNotebookList()}
        </div>
      </div>
    );
  }
}
