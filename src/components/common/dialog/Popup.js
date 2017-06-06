import React, { Component, PropTypes } from 'react';

class Popup extends Component {

  static propTypes = {
    pop: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    title: PropTypes.string,
    msg: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    confirm: PropTypes.shape({
      enable: PropTypes.bool,
      text: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
      callback: PropTypes.oneOfType([PropTypes.func, PropTypes.arrayOf(PropTypes.func)]),
    }).isRequired,
    cancel: PropTypes.shape({
      enable: PropTypes.bool,
      text: PropTypes.string,
      callback: PropTypes.func,
    }).isRequired,
    setPopup: PropTypes.func.isRequired,
  };

  handleClick = (e) => {
    const { confirm, cancel } = this.props;
    const className = e.target.className;
    switch (className) {
      case 'btn-submit':
        if (confirm.callback) confirm.callback();
        this.props.setPopup(null);
        break;
      case 'close':
      case 'btn-cancel':
        if (cancel.callback) cancel.callback();
        this.props.setPopup(null);
        break;
      default:
        if (className.indexOf('btn-submit') !== -1) {
          const callback = confirm.callback[className.replace('btn-submit ', '')];
          if (callback) callback();
          this.props.setPopup(null);
        }
    }
  };

  renderConfirmButton = () => {
    const { confirm: { text } } = this.props;
    if (text instanceof Array) {
      return text.map((value, index) => (
        <div key={`btn-submit-${index}`} className={`btn-submit ${index}`}>{value}</div>
      ));
    }
    return <div className="btn-submit">{text}</div>;
  };

  renderButtons = () => {
    const { confirm, cancel } = this.props;
    if ((confirm && confirm.enable) || (cancel && cancel.enable)) {
      return (
        <div className="buttons">
          {confirm.enable ? this.renderConfirmButton() : null}
          {cancel.enable ? <div className="btn-cancel">{cancel.text}</div> : null}
        </div>
      );
    }
    return null;
  };

  render() {
    const { pop, type, title, msg } = this.props;

    return (
      <div className="qnote-mask">
        <div className={`popup-${pop}`} onClick={this.handleClick}>
          <div className="close" />
          <div className="container">
            <div className={`icon-popup-${type}`} />
            <div className="message">
              <div className="title">{title}</div>
              <div className="text">{msg}</div>
            </div>
          </div>
          {this.renderButtons()}
        </div>
      </div>
    );
  }
}

export default Popup;
