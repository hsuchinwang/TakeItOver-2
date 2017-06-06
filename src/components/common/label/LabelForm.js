import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Label from './Label';
import LabelRelation from './LabelRelation';
import _ from 'lodash';
export default class LabelForm extends Component {

  static contextTypes = {
    lang: PropTypes.object.isRequired,
  };

  static propTypes = {
    labels: PropTypes.array,
    placeholder: PropTypes.string,
    relations: PropTypes.array,
    limit: PropTypes.number,
    mailParser: PropTypes.bool,
    tagParser: PropTypes.bool,
  };

  static defaultProps = {
    placeholder: '',
  };

  constructor(props) {
    super(props);
    this.addedLabels =[];
    this.removedLabels = [];
    this.state = {
      list: [],
      relations: [],
      relSelect: -1,
      overflow: false,
    };
  }

  componentWillMount() {
    const { labels } = this.props;
    if (labels && labels.length > 0) {
      this.setState({ list: labels.slice() });
    }
  }
  componentWillUpdate(nextProps, nextState) {
     if (nextProps.labels !== this.props.labels) {
       let mappingLabels = nextProps.labels.concat(this.addedLabels);
       this.removedLabels.map((tag) => {
          _.remove(mappingLabels, (n) => {
            return n == tag;
          });
       });
       this.setState({ list: mappingLabels });
    }
  }
  isSameLabel(labels, input) {
    if (labels.indexOf(input) > -1 || input.replace(/^\s+|\s+$/g, '') === '') {
      return true;
    }
    return false;
  }

  getList = () => this.state.list;

  pushList = (label) => {
    const { mailParser, tagParser } = this.props;
    let list = [...this.state.list, label];
    this.addedLabels.push(label);
    if (mailParser) {
      const mails = label.match(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/g);
      if (mails) {
        list = [...this.state.list];
        mails.forEach(val => {
          if (!this.isSameLabel(this.state.list, val)) list.push(val);
        });
      }
    } else if (tagParser) {
      list = [...this.state.list];
      const tags = label.split(';');
      tags.forEach(val => {
        const tag = val.trim();
        if (!this.isSameLabel(this.state.list, tag)) list.push(tag);
      });
    }
    
    this.refs.labelText.value = '';
    this.setState({
      list,
      relSelect: -1,
      relations: [],
      overflow: false,
    });
  };

  handleKeyDown = (e) => {
    const { list, relations, relSelect } = this.state;
    const { limit } = this.props;
    const value = this.refs.labelText.value.trim();
    switch (e.keyCode) {
      case 13:// enter
        if (value !== '' && !this.isSameLabel(list, value)) {
          if (limit && value.length > limit) {
            this.setState({ overflow: true });
          } else {
            this.pushList(value);
          }
        }
        e.preventDefault();
        break;
      case 8:// delete
        if (list.length > 0 && value === '') {
          this.removedLabels.push(_.last(list));
          list.pop();
          this.setState(this.state);
          e.preventDefault();
        }
        break;
      case 38:// up
        if (relations.length > 0 && relSelect > 0) {
          this.state.relSelect--;
          const item = ReactDOM.findDOMNode(this.refs.labelRel.refs[`relItem${this.state.relSelect}`]);
          const itemBox = ReactDOM.findDOMNode(this.refs.labelRel.refs.relItemBox);
          if (item.offsetTop < itemBox.scrollTop) itemBox.scrollTop -= itemBox.scrollTop - item.offsetTop;
          this.refs.labelText.value = relations[this.state.relSelect];
          this.setState(this.state);
          e.preventDefault();
        }
        break;
      case 40:// down
        if (relations.length > 0 && (relSelect === -1 || relSelect < relations.length - 1)) {
          this.state.relSelect++;
          const item = ReactDOM.findDOMNode(this.refs.labelRel.refs[`relItem${this.state.relSelect}`]);
          const itemBox = ReactDOM.findDOMNode(this.refs.labelRel.refs.relItemBox);
          if ((item.offsetTop + item.offsetHeight - itemBox.scrollTop) > itemBox.offsetHeight) itemBox.scrollTop += item.offsetTop + item.offsetHeight - itemBox.scrollTop - itemBox.offsetHeight;
          this.refs.labelText.value = relations[this.state.relSelect];
          this.setState(this.state);
          e.preventDefault();
        } else if (relations.length === 0 && relSelect === -1) {
          if (!this.props.relations) return;
          this.setState({ relations: this.props.relations });
        }
        break;
      case 37:// left
        break;
      case 39:// right
        break;
      default:
    }
  };

  handleLabelInputBlur = () => {
    const { list, relations } = this.state;
    const { limit } = this.props;
    let timer = 0;
    if (relations.length > 0) {
      timer = 200;
    }

    setTimeout(() => {
      const value = this.refs.labelText.value.trim();
      if (value !== '' && !this.isSameLabel(list, value)) {
        if (limit && value.length > limit) {
          this.setState({ overflow: true });
        } else {
          this.pushList(value);
        }
      }
      this.setState({ relations: [] });
    }, timer);
  };

  handleChange = () => {
    const text = this.refs.labelText.value;
    const { relations } = this.props;

    if (this.state.relSelect > -1) {
      this.state.relSelect = -1;
      this.setState(this.state);
    }

    if (!relations) return;
    this.state.relations = [];
    for (const ind in relations) {
      const value = relations[ind];
      if (text !== '' && value !== '' && value.indexOf(text) > -1) {
        this.state.relations.push(value);
      }
    }
    this.setState(this.state);
  };

  handleClick(e, props) {
    this.removedLabels.push(this.state.list[props.index]);
    this.state.list.splice(props.index, 1);
    this.setState(this.state);
  }

  handleContactSelect = (e, value) => {
    this.refs.labelText.focus();
    this.refs.labelText.value = value;
  };

  renderLabels = () => {
    const { list } = this.state;
    if (!list) return;

    return list.map((text, index) => (
      <Label key={`label-${index}`}
        index={index}
        name={text}
        remove={this.handleClick.bind(this)}
      />
    ));
  };

  renderRelations = () => {
    if (this.state.relations.length > 0) {
      return (
        <LabelRelation
          ref="labelRel"
          relations={this.state.relations}
          select={this.state.relSelect}
          click={this.handleContactSelect.bind(this)}
        />
      );
    }
    return null;
  };

  render() {
    return (
      <div className="label-form" >
        <div className="label-form-container">
          {this.renderLabels()}
          <textarea className="label-text"
            ref="labelText"
            autoFocus
            placeholder={this.props.placeholder}
            onKeyDown={this.handleKeyDown}
            onBlur={this.handleLabelInputBlur}
            onChange={this.handleChange}
          />
          {this.state.overflow ? <div className="label-warning">{this.context.lang.window_tag_maximum}</div> : null}
        </div>
        {this.renderRelations()}
      </div>
    );
  }
}
