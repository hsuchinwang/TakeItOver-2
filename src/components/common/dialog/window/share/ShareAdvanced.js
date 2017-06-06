import React, { PropTypes } from 'react';
import ShareAdvancedItem from './ShareAdvancedItem';

class ShareAdvanced extends React.Component {

  static propTypes = {
    title: PropTypes.string.isRequired,
    shareAccessList: PropTypes.array.isRequired,
    layer: PropTypes.number.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      accessList: [],
      init: true,
    };
  }

  componentWillMount() {
    this.initAccessList();
  }

  componentDidUpdate() {
    this.initAccessList();
  }

  initAccessList = () => {
    const { shareAccessList } = this.props;

    if (this.state.init && this.state.accessList.length === 0 && shareAccessList.length > 0) {
      this.setState({
        accessList: shareAccessList.map((obj) => ({ ...obj })),
        init: false,
      });
    }
  };

  getAccessList = () => {
    return this.state.accessList;
  };

  handleChange = (that, index) => {
    const { accessList } = this.state;
    accessList[that.props.index].permission = index;
    this.setState({ accessList });
  };

  handleDelete = (e, that) => {
    this.state.accessList.splice(that.props.index, 1);
    this.setState({ accessList: this.state.accessList });
  };

  renderPeople = () => {
    const { accessList } = this.state;
    const { layer } = this.props;

    return accessList.map((value, index) => {
      return (
        <ShareAdvancedItem key={`people-${index}`} index={index} people={value} edit={(value.type == layer)} change={this.handleChange.bind(this)} del={this.handleDelete} />
      );
    });
  };

  render() {
    const { title } = this.props;

    return (
      <div className="share-advanced-form">
        <div className="content-title">{title}</div>
        <div className="content-box">
            {this.renderPeople()}
        </div>
      </div>
    );
  }
}

export default ShareAdvanced;
