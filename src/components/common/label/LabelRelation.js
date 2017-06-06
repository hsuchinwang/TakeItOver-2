import React, { PropTypes } from 'react';
import classnames from 'classnames';

class LabelRelation extends React.Component {

  static propTypes = {
    relations: PropTypes.array.isRequired,
    click: PropTypes.func,
    select: PropTypes.number,
  };

  renderRelations = () => {
    const { relations, click, select } = this.props;

    return relations.map((value, index) => (
      <div
        ref={`relItem${index}`}
        key={`relation-item-${index}`}
        className={classnames('item', { 'item-selected': (select === index) })}
        onClick={e => click(e, value)}
      >
        {value}
      </div>
    ));
  };

  render() {
    return (
      <div className="label-relation" ref="relItemBox">
        {this.renderRelations()}
      </div>
    );
  }
}

export default LabelRelation;
