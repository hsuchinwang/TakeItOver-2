import React, { PropTypes } from 'react';

class SwitchButton extends React.Component {

  static propTypes = {
    id: PropTypes.string.isRequired,
    status: PropTypes.bool,
    callback: PropTypes.shape({
      onFunc: PropTypes.func,
      offFunc: PropTypes.func,
    }),
  };

  constructor(props) {
    super(props);
    this.state = {
      checked: !!props.status || false,
    };
  }

  handleChange = (e) => {
    const checked = e.target.checked;
    const { callback } = this.props;

    this.setState({ checked });
    if (checked && callback && 'onFunc' in callback) {
      callback.onFunc();
    } else if (!checked && callback && 'offFunc' in callback) {
      callback.offFunc();
    }
  };

  isChecked = () => this.state.checked;

  render() {
    const { id } = this.props;
    return (
      <div className="qnote-switch-btn">
        <input
          id={ id }
          className="switch-checkbox"
          type="checkbox"
          onChange={ this.handleChange }
          defaultChecked={ this.state.checked }
        />
        <label
          className="switch-label"
          htmlFor={ id }
        />
      </div>
    );
  }
}

export default SwitchButton;
