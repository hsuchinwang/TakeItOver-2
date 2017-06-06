import React, { PropTypes } from 'react';
import Crumb from './Crumb';

class BreadCrumb extends React.Component {

  static propTypes = {
    crumbs: PropTypes.arrayOf(PropTypes.shape({
      text: PropTypes.string.isRequired,
      icon: PropTypes.string,
      action: PropTypes.func,
    })),
  };

  renderCrumbs = () => {
    const { crumbs } = this.props;
    const content = [];
    if (!crumbs) return null;
    for (let i = 0; i < crumbs.length; i++) {
      const obj = crumbs[i];
      content.push(
        <Crumb text={obj.text} icon={obj.icon} action={obj.action} key={`crumb-${i}`} />
      );
      if (i < (crumbs.length - 1)) {
        content.push(<div className="crumb-divide" key={`divide-${i}`} />);
      }
    }
    return content;
  };

  render() {
    return (
      <div className="qnote-breadcrumb">{this.renderCrumbs()}</div>
    );
  }

}

export default BreadCrumb;
