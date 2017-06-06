import React, { PropTypes } from 'react';

function LoadingMask(props, context) {
  const displayText = props.displayText || context.lang.message_common_loading;
  return (
    <div className="fullscreenMask">
      <div className="message-loading">
        <div className="icon" />
        <div className="text">{displayText}</div>
      </div>
    </div>
  );
}

LoadingMask.contextTypes = {
  lang: PropTypes.object.isRequired,
};

LoadingMask.propTypes = {
  displayText: PropTypes.string,
};

LoadingMask.defaultProps = {
  displayText: '',
};

export default LoadingMask;
