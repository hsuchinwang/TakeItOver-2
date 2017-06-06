import React, { PropTypes } from 'react';

class InputText extends React.Component {

  static propTypes = {
    defaultValue: PropTypes.string,
    filter: PropTypes.bool,
    search: PropTypes.bool,
    change: PropTypes.func,
    keydown: PropTypes.func,
    blur: PropTypes.func,
    clear: PropTypes.func,
    searchFunc: PropTypes.func,
    inputType: PropTypes.string,
    holder: PropTypes.string,
    autoFocus: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.state = {
      text: props.defaultValue ? props.defaultValue : null,
      isBlur: false,
    };
  }

  handleChange = (e) => {
    const { change } = this.props;
    if (change) change(e);
    this.setState({ text: e.target.value });
  };

  handleBlur = (e) => {
    const { blur } = this.props;
    setTimeout(() => {
      const { isBlur } = this.state;
      if (blur && !isBlur) blur(e);
      if (isBlur) this.setState({ isBlur: false });
    }, 200);
  };

  handleKeyDown = (e) => {
    const { keydown } = this.props;
    if (keydown) keydown(e);
  };

  handleClear = (e) => {
    const { clear } = this.props;
    if (clear) clear(e);
    this.refs.qInputText.value = null;
    this.setState({ text: null, isBlur: true });
    this.refs.qInputText.focus();
  };

  renderField = () => {
    const { text } = this.state;
    const { search, filter, searchFunc } = this.props;

    if (search) {
      if (!text || text.length == 0) {
        return (
          <div className="icon-header-btn_header_search_normal" />
        );
      }
      return (
        <div className="icon-header-btn_header_search_on" onClick={searchFunc} />
      );
    }

    if (!text || text.length == 0) {
      if (filter) {
        return (
          <div className="icon-sidebar-btn_tag_filter_normal" />
        );
      }
    } else {
      return (
        <div className="icon-input-btn_text_close" onClick={this.handleClear} />
      );
    }
  };

  value = () => {
    return this.refs.qInputText.value;
  };

  clear = () => {
    this.refs.qInputText.value = null;
    this.setState({ text: null, isBlur: true });
  };

  focus = () => {
    this.refs.qInputText.focus();
  };

  render() {
    const { text } = this.state;
    const { autoFocus } = this.props;
    let { inputType, holder } = this.props;
    inputType = inputType ? inputType : 'text';
    holder = holder ? holder : '';

    return (
      <div className="qnote-input-text">
        <input ref="qInputText" type={inputType} placeholder={holder} onChange={this.handleChange} onKeyDown={this.handleKeyDown} onBlur={this.handleBlur} defaultValue={text} autoFocus={(autoFocus)} />
        <div className="clear-field">
          {this.renderField() }
        </div>
      </div>
    );
  }
}

export default InputText;
