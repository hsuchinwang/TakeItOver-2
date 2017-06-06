import React, { PropTypes } from 'react';

export default class Crumb extends React.Component {

  static propTypes = {
    text: PropTypes.string.isRequired,
    icon: PropTypes.string,
    action: PropTypes.func,
  };

  handleClick = () => {
    const { action } = this.props;
    if (action) action();
  };

  render() {
    const { text, icon, action } = this.props;
    const iconStyle = icon || '';
    const styles = action ? { cursor: 'pointer' } : { cursor: 'default' };
    return (
      <div className="qnote-crumb" style={ styles } onClick={ this.handleClick }>
        <div className={ iconStyle } />
        <div title={ text } className="crumb-text">{text}</div>
      </div>
    );
  }
}
