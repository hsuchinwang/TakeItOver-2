import React, { PropTypes } from 'react';
import classnames from 'classnames';

function LabelSelect(props) {
  const { checked, name, change } = props;
  return (
    <div className="label-item" onClick={e => change(e, props)}>
      <div className={classnames('qnote-input-checkbox', { active: checked })} />
      <div className="item-name">{name}</div>
    </div>
  );
}

LabelSelect.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  change: PropTypes.func.isRequired,
};

export default LabelSelect;
