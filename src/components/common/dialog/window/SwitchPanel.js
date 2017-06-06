import React, { Component, PropTypes } from 'react';
import createFragment from 'react-addons-create-fragment';

export default class SwitchPanel extends Component {
  static propTypes = {
    children: PropTypes.arrayOf(PropTypes.element).isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      currentPanelIndex: 0,
    };
  }

  handleSelectChange = () => {
    this.setState({
      currentPanelIndex: this.refs.select.value,
    });
  };

  render() {
    const { currentPanelIndex } = this.state;
    let childrenFragment = {};
    const options = this.props.children.map((element, index) => {
      const { optionID, optionName } = element.props;
      childrenFragment[optionID] = element;
      return (
        <option value={index} key={`option_${optionID}`} >
          {optionName}
        </option>
      );
    });
    childrenFragment = createFragment(childrenFragment);

    return (
      <div className="switchPanel">
        <select onChange={this.handleSelectChange} ref="select">
          {options}
        </select>
        <hr />
        <div className="switchPanelContainer">
          {childrenFragment[currentPanelIndex]}
        </div>
      </div>
    );
  }
}
