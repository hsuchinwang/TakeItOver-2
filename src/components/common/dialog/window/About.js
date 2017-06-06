import React, { PropTypes } from 'react';
import Window from '../Window';
import { VERSION_NAME } from '../../../../constants/Config';

const About = function About(props, context) {
  const { lang, version } = context;
  return (
    <Window
      type="about"
      title={lang.window_about_title}
      hasTitleIcon
      setWindow={props.actions.sys.setWindow}
      apply={{
        enable: false,
      }}
      cancel={{
        enable: false,
      }}
    >
      <div className="top">
        <div className="logo" />
        <div className="appName">
          <span className="thick">Notes</span>Station {VERSION_NAME}
        </div>
        <div className="version">{`${lang.window_about_version}: V${version}`}</div>
      </div>
      <div className="bottom">
        <div className="leftPanel">
          <div className="qnap-logo-wrapper">
            <div className="logo" />
            <a href="http://www.qnap.com" target="_blank">www.qnap.com</a>
          </div>
          <div className="copyright">©2016 QNAP Systems, Inc. All Rights Reserved.</div>
        </div>
        <div className="qts-logo" />
      </div>
    </Window>
  );
};

About.contextTypes = {
  lang: PropTypes.object.isRequired,
  version: PropTypes.string.isRequired,
};

About.propTypes = {
  actions: PropTypes.shape({
    sys: PropTypes.shape({
      setWindow: PropTypes.func.isRequired,
    }),
  }),
};

export default About;
