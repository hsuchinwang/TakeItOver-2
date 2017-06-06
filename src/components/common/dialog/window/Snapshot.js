import React, { Component, PropTypes } from 'react';
import Window from '../Window';

class Snapshot extends Component {

  static propTypes = {
    actions: PropTypes.shape({
      note: PropTypes.shape({
        setSnapshot: PropTypes.func.isRequired,
      }),
      sys: PropTypes.shape({
        setWindow: PropTypes.func.isRequired,
      }),
    }),
    sys: PropTypes.shape({
      windowPara: PropTypes.shape({
        name: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
        connId: PropTypes.string.isRequired,
      }),
    }),
  };

  constructor(props) {
    super(props);
    const date = new Date(Date.now());
    this.dateTime = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}_${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;
  }

  componentDidMount() {
    this.refs.snapshotName.select();
  }

  handleSubmit = () => {
    const {
      sys: {
        windowPara: { name, id, connId },
      },
      actions: {
        note: { setSnapshot },
        sys: { setWindow },
      },
    } = this.props;

    const snapshotName = this.refs.snapshotName.value !== '' ? this.refs.snapshotName.value : `${name}_${this.dateTime}`;
    setSnapshot(id, connId, snapshotName);
    setWindow(null);
  };

  render() {
    const { name } = this.props.sys.windowPara;

    return (
      <Window
        type="snapshot"
        title={window.lang_dictionary.general_snapshot}
        setWindow={this.props.actions.sys.setWindow}
        apply={{
          enable: true,
          text: window.lang_dictionary.btn_confirm,
          callback: () => {
            this.handleSubmit();
          },
        }}
        cancel={{
          enable: true,
          text: window.lang_dictionary.btn_cancel,
          callback: () => {},
        }}
      >
        <div className="snapshot-field">
          <div className="title">{window.lang_dictionary.window_snapshot_name}:</div>
          <input className="name" ref="snapshotName" defaultValue={`${name}_${this.dateTime}`} />
        </div>
      </Window>
    );
  }
}

export default Snapshot;
