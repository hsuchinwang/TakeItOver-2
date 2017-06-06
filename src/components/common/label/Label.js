import React, { PropTypes } from 'react';

function Label(props) {
  return (
    <div className="label-item" title={props.name}>
      <span className="item-name">{props.name}</span>
      <div className="item-close" onClick={e => props.remove(e, props)} />
    </div>
  );
}

Label.propTypes = {
  name: PropTypes.string.isRequired,
  remove: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
};

export default Label;
