import React, { Component, PropTypes } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Message from './Message';

class MessageContainer extends Component {

  static propTypes = {
    sys: PropTypes.shape({
      msgQueue: PropTypes.arrayOf(PropTypes.shape({
        type: PropTypes.string.isRequired,
        msg: PropTypes.string.isRequired,
        err: PropTypes.bool,
        time: PropTypes.number,
        key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      })).isRequired,
    }),
    actions: PropTypes.shape({
      sys: PropTypes.shape({
        popMessage: PropTypes.func.isRequired,
      }).isRequired,
    }),
  };

  render() {
    let msgs = this.props.sys.msgQueue.map((obj, index) => {
      return (
        <Message
          type={obj.type}
          message={obj.msg}
          err={obj.err}
          time={obj.time}
          key={obj.key}
          popKey={obj.key}
          popMessage={this.props.actions.sys.popMessage}
        />
      );
    });

    return (
      <ReactCSSTransitionGroup className="qnote-msg-box" transitionName="showHide" transitionEnterTimeout={500} transitionLeaveTimeout={300}>
        {msgs}
      </ReactCSSTransitionGroup>
    );
  }
}

export default MessageContainer;
