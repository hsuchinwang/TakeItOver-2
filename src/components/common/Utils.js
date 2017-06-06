import React, { PropTypes } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import * as Dialogs from './dialog/DialogsMap';

import LoadingMask from './LoadingMask';
import Tutorial from '../tutorial/Tutorial';

export default class Utilits extends React.Component {

  static propTypes = {
    sys: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  renderLoadingMask = () => {
    const { loadingMask } = this.props.sys;
    if (loadingMask.length === 0) return null;
    return (
      <LoadingMask />
    );
  };

  renderWindow = () => {
    const windowType = this.props.sys.windowType;
    if (!windowType || !Dialogs[windowType]) return null;
    const Window = Dialogs[windowType];
    return (
      <Window {...this.props} />
    );
  };

  renderPop = () => {
    const popType = this.props.sys.popType;
    if (!popType) return null;
    const Popup = require(`./dialog/popup/${this.props.sys.popType}.js`).default;
    return (
      <Popup {...this.props} />
    );
  };

  renderTutorial = () => {
    if (+this.props.user.tutorial !== 1) return null;
    return (
      <Tutorial {...this.props.actions.user} />
    );
  };

  render() {
    const utilits = [this.renderWindow, this.renderPop, this.renderTutorial];
    const childComponent = utilits.map((func, index) => (
      <ReactCSSTransitionGroup
        key={index}
        transitionEnterTimeout={200}
        transitionLeaveTimeout={250}
        transitionName="showHide"
      >
        {func()}
      </ReactCSSTransitionGroup>
    ));
    return (
      <div>
        {this.renderLoadingMask()}
        {childComponent}
      </div>
    );
  }

}
