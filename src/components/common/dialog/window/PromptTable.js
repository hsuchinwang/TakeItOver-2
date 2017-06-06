import React, { PropTypes } from 'react';
import Window from '../Window';

class PromptTable extends React.Component {

  static contextTypes = {
    lang: PropTypes.object.isRequired,
  };

  static propTypes = {
    actions: PropTypes.object.isRequired,
    sys: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = { row: 0, col: 0 };
  }

  selectedSize(row, col) {
    this.setState({ row, col });
  }

  insertTable = () => {
    this.props.sys.windowPara.callback({
      rows: 10 - this.state.row + 1,
      cols: 10 - this.state.col + 1,
    });
    this.props.actions.sys.setWindow(null, 0, null);
  }

  renderTableCells(rowNum) {
    const cells = [];
    for (let i = 10; i > 0; i--) {
      cells.push(
        <td
          className={this.state.row <= rowNum && this.state.col <= i ? 'selected' : ''}
          key={i}
          onMouseOver={() => this.selectedSize(rowNum, i)}
          onClick={this.insertTable}
        >
        </td>
      );
    }
    return cells;
  }

  renderTableRows() {
    const rows = [];
    for (let i = 10; i > 0; i--) {
      rows.push(<tr key={i}>{this.renderTableCells(i)}</tr>);
    }
    return rows;
  }

  render() {
    const { row, col } = this.state;
    const { lang } = this.context;
    const cancel = { enable: true, text: lang.btn_cancel };
    return (
      <Window
        type="prompt-table"
        title={lang.editor.promptTable}
        setWindow={this.props.actions.sys.setWindow}
        apply={{ enable: false }}
        cancel={cancel}
      >
        <table className="ProseMirror-tableselector">
          <tbody>{this.renderTableRows()}</tbody>
        </table>
        <div id="size-hint">{10 - row + 1} x {10 - col + 1}</div>
      </Window>
    );
  }

}
export default PromptTable;
