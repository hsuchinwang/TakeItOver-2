import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Header from '../components/common/header/index';
import PublicContainer from '../components/public/PublicContainer';
import * as NoteActions from '../actions/note/index';
import * as SysActions from '../actions/sysActions';
import * as TagActions from '../actions/tagActions';
import * as ShareActions from '../actions/shareActions';
import * as UserActions from '../actions/userActions';
import * as PublicActions from '../actions/publicActions';

class PubilcPreview extends React.Component {

  static propTypes = {
    params: PropTypes.object.isRequired,
    actions: PropTypes.shape({
      publicLink: PropTypes.object.isRequired,
    }),
    publicLink: PropTypes.object.isRequired,
  };

  componentWillMount() {
    const key = this.props.params.hashKey;
    this.props.actions.publicLink.getPublicTreeList(key);
  }

  renderFoundPage = () => {
    const {
      publicLink: { publicSecList },
    } = this.props;

    let onlyOne = true;
    const secKeys = Object.keys(publicSecList);
    if (secKeys.length > 1) onlyOne = false;
    else if (secKeys.length === 1 && publicSecList[secKeys[0]].list.length > 1) onlyOne = false;

    return (
      <div className="qnote-wrap">
        <Header disable />
        <div className="qnote-container">
          <div className="qnote-container-right">
            <PublicContainer {...this.props} onlyOne={onlyOne} />
          </div>
        </div>
      </div>
    );
  };

  renderNotFoundPage = () => (
    <div className="qnote-wrap">
      <Header disable />
      <div className="qnote-container">
        <div className="qnote-container-full">
          <div>{'404 - Page Not Found'}</div>
        </div>
      </div>
    </div>
  );

  render() {
    const {
      publicLink: { publicLinkNotFound },
    } = this.props;
    let content = (<div className="qnote-wrap">{'Loading...'}</div>);
    if (publicLinkNotFound === true) content = this.renderNotFoundPage();
    else if (publicLinkNotFound === false) content = this.renderFoundPage();
    return (content);
  }
}

function mapStateToProps(state) {
  return state;
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      note: bindActionCreators(NoteActions, dispatch),
      user: bindActionCreators(UserActions, dispatch),
      sys: bindActionCreators(SysActions, dispatch),
      tag: bindActionCreators(TagActions, dispatch),
      share: bindActionCreators(ShareActions, dispatch),
      publicLink: bindActionCreators(PublicActions, dispatch),
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PubilcPreview);
