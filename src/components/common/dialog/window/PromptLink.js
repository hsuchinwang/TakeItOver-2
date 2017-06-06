import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Window from '../Window';

class PromptLink extends Component {

  static contextTypes = {
    lang: PropTypes.object.isRequired,
  };

  static propTypes = {
    actions: PropTypes.object.isRequired,
    sys: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      valid: false,
      link: '',
      title: '',
    };
  }

  updateInput = () => {
    const link = ReactDOM.findDOMNode(this.refs.link);
    const title = ReactDOM.findDOMNode(this.refs.title);
    const validLink = link.value && link.value.match(/^(https?):\/\/((?:[a-z0-9.-]|%[0-9A-F]{2}){3,})(?::(\d+))?((?:\/(?:[a-z0-9-._~!$&'()*+,;=:@]|%[0-9A-F]{2})*)*)(?:\?((?:[a-z0-9-._~!$&'()*+,;=:\/?@]|%[0-9A-F]{2})*))?(?:#((?:[a-z0-9-._~!$&'()*+,;=:\/?@]|%[0-9A-F]{2})*))?$/i);
    this.setState({
      link: link.value,
      title: title.value,
      valid: (link.value.length && validLink && title.value.length) > 0,
    });
  }

  submit = () => {
    this.props.sys.windowPara.callback({
      href: this.state.link,
      title: this.state.title,
    });
    this.props.actions.sys.setWindow(null, 0, null);
  }

  render() {
    const { lang } = this.context;
    const { link, title, valid } = this.state;
    const apply = {
      enable: this.state.valid,
      text: lang.btn_submit,
      callback: this.submit,
    };
    const cancel = { enable: true, text: lang.btn_cancel };
    const { editor: { promptLink, Link, Title } } = lang;
    return (
      <Window
        type="prompt-link"
        title={promptLink}
        setWindow={this.props.actions.sys.setWindow}
        apply={apply}
        cancel={cancel}
      >
        <div className="field-row">
          <div className="title">{Link}</div>
          <input type="text" ref="link" className={ !link || valid ? '' : 'text-error' } value={this.state.link} onChange={this.updateInput} />
        </div>
        <div className="field-row">
          <div className="title">{Title}</div>
          <input type="text" ref="title" value={title} onChange={this.updateInput} />
        </div>
      </Window>
    );
  }

}
export default PromptLink;
