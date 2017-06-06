import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';

export default class ImportPrototype extends Component {
  static propTypes = {
    className: PropTypes.string.isRequired,
    radioButtons: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
    })).isRequired,
    children: PropTypes.arrayOf(PropTypes.element).isRequired
  };

  handleRadioChanged = (id) => {
    this.setState({
      isSelected: id
    });
  };

  renderRadioButtons = () => {
    const { isSelected } = this.state;
    const { children, radioButtons } = this.props;
    return radioButtons.map((item, index) => {
      return (
        <div key={`export-radio-${index}`} onClick={this.handleRadioChanged.bind(this, index)}>
          <div className="custom-radio">
            <div className={classnames('qnote-input-radio', { active: isSelected == index })} />
            <div>{item.title}</div>
          </div>
          {children[index]}
        </div>
      );
    });
  };

  constructor(props) {
    super(props);
    this.state = {
      isSelected: 0
    };
  }

  render() {
    return (
      <div className={this.props.className}>
        <div className="radioPanel">
          {this.renderRadioButtons()}
        </div>
      </div>
    );
  }
}
