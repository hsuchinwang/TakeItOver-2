import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

class Window extends Component {
  static propTypes = {
    type: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    hasTitleIcon: PropTypes.bool,
    selected: PropTypes.number,
    setTabSelected: PropTypes.func,
    handleTabSelect: PropTypes.func,
    setWindow: PropTypes.func.isRequired,
    children: PropTypes.any,
    errorMessage: PropTypes.shape({
      enable: PropTypes.bool,
      text: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    }),
    tabs: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
    })),
    apply: PropTypes.shape({
      enable: PropTypes.bool,
      disable: PropTypes.bool,
      text: PropTypes.string,
      callback: PropTypes.func,
    }).isRequired,
    cancel: PropTypes.shape({
      enable: PropTypes.bool,
      disable: PropTypes.bool,
      text: PropTypes.string,
      callback: PropTypes.func,
    }).isRequired,
  };

  static defaultProps = {
    errorMessage: {
      enable: false,
    },
    hasTitleIcon: false,
  };

  constructor(props) {
    super(props);
    this.finish = false;
    this.state = {
      showTabBtn: false,
    };
  }

  componentDidMount() {
    const { tabContent } = this.refs;

    if (tabContent) {
      const tabBar = ReactDOM.findDOMNode(tabContent);
      if (tabBar.scrollWidth > tabBar.offsetWidth) this.setState({ showTabBtn: true });
    }
  }

  handleClick = (e) => {
    const { apply, cancel } = this.props;
    const tabContent = ReactDOM.findDOMNode(this.refs.tabContent);

    switch (e.target.className) {
      case 'btn-submit':
        if (!this.finish && apply.callback) {
          apply.callback();
          this.finish = true;
          setTimeout(() => {
            this.finish = false;
          }, 2000);
        }
        break;
      case 'close':
      case 'btn-cancel':
        this.props.setWindow(null);
        if (cancel.callback) cancel.callback();
        break;
      case 'btn-left':
        tabContent.scrollLeft -= tabContent.offsetWidth / 2;
        break;
      case 'btn-right':
        tabContent.scrollLeft += tabContent.offsetWidth / 2;
        break;
      default:
        break;
    }
  };

  handleTabClick = (index, id, e) => {
    const { handleTabSelect, setTabSelected } = this.props;
    const tabContent = ReactDOM.findDOMNode(this.refs.tabContent);
    const left = e.target.offsetLeft - 35;
    if ((left + e.target.offsetWidth - tabContent.scrollLeft) > tabContent.offsetWidth) {
      tabContent.scrollLeft += (e.target.offsetWidth - (tabContent.offsetWidth - left + tabContent.scrollLeft));
    } else if (left < tabContent.scrollLeft) {
      tabContent.scrollLeft -= (tabContent.scrollLeft - left);
    }

    if (handleTabSelect) {
      handleTabSelect(id);
    } else {
      setTabSelected(index);
    }
  };

  renderTab = () => {
    const { tabs, selected } = this.props;
    if (!tabs || tabs.length === 0) return null;

    const tab = tabs.map((obj, index) => (
      <div className={selected === index ? 'tab-btn tab-btn-selected' : 'tab-btn'} title={obj.title} key={obj.id} onClick={this.handleTabClick.bind(this, index, obj.id)}>
        {obj.title}
      </div>
    ));

    return (
      <div className="tab">
        <div className="btn-left" style={!this.state.showTabBtn ? { visibility: 'hidden' } : {}}/>
        <div className="content" ref="tabContent">
          {tab}
        </div>
        <div className="btn-right" style={!this.state.showTabBtn ? { visibility: 'hidden' } : {}}/>
      </div>
    );
  };

  renderButtons = () => {
    const { apply, cancel } = this.props;
    if ((apply && apply.enable) || (cancel && cancel.enable)) {
      return (
        <div className="buttons">
          {apply.enable ? <div className={apply.disable ? 'btn-disable' : 'btn-submit'}>{apply.text}</div> : null}
          {cancel.enable ? <div className="btn-cancel">{cancel.text}</div> : null}
        </div>
      );
    }
    return null;
  };

  render() {
    const { type, title, children, errorMessage, hasTitleIcon } = this.props;
    const { enable, text } = errorMessage;
    return (
      <div className="qnote-mask" tabIndex={-1}>
        <div className={`window-${type}`} onClick={this.handleClick} tabIndex={-1}>
          <div className="close" />
          <div className="header">
            <div className="title-wrapper">
              {hasTitleIcon ? <div className="logo" /> : null}
              <div className="title">{title}</div>
            </div>
            {this.renderTab()}
            <div className="hr" />
          </div>
          <div className="container">{children}</div>
          <div className="footer">
            <ReactCSSTransitionGroup transitionEnterTimeout={200} transitionLeaveTimeout={250} transitionName="showHide">
              {enable ? <div className="errorMessage">{text}</div> : null}
            </ReactCSSTransitionGroup>
            {this.renderButtons()}
          </div>
        </div>
      </div>
    );
  }
}

export default Window;
