import React, { PropTypes } from 'react';

function SideBar(props) {
  let style = props.sys.fullscreen ? { left: '-350px' } : {};

  function handleClick() {
    if (!props.sys.sidebarDisable) {
      props.actions.sys.setFullScreen();
    }
  }

  return (
    <div className="qnote-sidebar" style={style}>
      {props.children}
      <div className="sidebar-collapsed" onClick={handleClick} />
    </div>
  );
}

SideBar.propTypes = {
  sys: PropTypes.object.isRequired,
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  actions: PropTypes.object.isRequired,
};

export default SideBar;
