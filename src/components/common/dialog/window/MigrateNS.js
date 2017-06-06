import React, { PropTypes } from 'react';
import Window from '../Window';

const MigrateNS = function MigrateNS(props, context) {
  const { lang } = context;
  const {
    actions: {
      sys: { setMigrateNS, setWindow },
    },
  } = props;

  return (
    <Window
      type="migrate"
      title={lang.header_more_migrate_old}
      hasTitleIcon
      setWindow={props.actions.sys.setWindow}
      apply={{
        enable: true,
        text: lang.window_migrate_btn_confirm,
        callback: () => {
          props.actions.sys.setPopup('MigrateConfirmPop', {
            confirmCallback: () => {
              setMigrateNS();
              setWindow(null);
            },
          });
        },
      }}
      cancel={{
        enable: true,
        text: lang.btn_cancel,
        callback: () => {},
      }}
    >
      <div className="describe">{lang.window_migrate_describe}</div>
      <div className="warning">{`＊ ${lang.window_migrate_warning}`}</div>
    </Window>
  );
};

MigrateNS.contextTypes = {
  lang: PropTypes.object.isRequired,
};

MigrateNS.propTypes = {
  actions: PropTypes.shape({
    sys: PropTypes.shape({
      setWindow: PropTypes.func.isRequired,
      setMigrateNS: PropTypes.func.isRequired,
    }),
  }),
};

export default MigrateNS;
