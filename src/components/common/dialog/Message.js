import React, { Component, PropTypes } from 'react';

class Message extends Component {

  static propTypes = {
    type: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    err: PropTypes.bool,
    time: PropTypes.number,
    popKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    popMessage: PropTypes.func.isRequired,
  };

  componentDidMount() {
    if (this.props.time) {
      setTimeout(() => {
        this.props.popMessage(this.props.popKey);
      }, this.props.time);
    }
  }

  setContent = () => {
    const { type, message } = this.props;
    switch (type) {
      case 'message':
        return (
          <div>
            <div className="close" onClick={this.handleClose} />
            <span>{message}</span>
          </div>
        );
      case 'loading':
        return (
          <div>
            <div className="icon-loading" />
            <div className="content-msg">{message}</div>
          </div>
        );
      case 'task':
        break;
      default:
        return null;
    }
    return null;
  };

  handleClose = () => {
    this.props.popMessage(this.props.popKey);
  };

  render() {
    const styleClass = (this.props.err) ? 'qnote-msg qnote-msg-error' : 'qnote-msg';

    return (
      <div className="qnote-msg-container">
        <div className={styleClass}>{this.setContent()}</div>
      </div>
    );
  }
}

export default Message;
