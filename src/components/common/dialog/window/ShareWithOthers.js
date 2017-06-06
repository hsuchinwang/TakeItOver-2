import React, { PropTypes } from 'react';
import Window from '../Window';
import ShareLabelForm from './share/ShareLabelForm';
import SharePublic from './share/SharePublic';
import ShareAdvanced from './share/ShareAdvanced';

class ShareWithOthers extends React.Component {

  static contextTypes = {
    lang: PropTypes.object.isRequired,
  };

  static propTypes = {
    actions: PropTypes.shape({
      share: PropTypes.shape({
        getAccessList: PropTypes.func.isRequired,
        setShareAccess: PropTypes.func.isRequired,
        initPublicLink: PropTypes.func.isRequired,
        createPublicLink: PropTypes.func.isRequired,
        setPublicLink: PropTypes.func.isRequired,
        setShareWithOthersToDB: PropTypes.func.isRequired,
        getMyContactList: PropTypes.func.isRequired,
        getNasUsers: PropTypes.func.isRequired,
        initShareInfo: PropTypes.func.isRequired,
      }),
      sys: PropTypes.shape({
        setWindow: PropTypes.func.isRequired,
        setPopup: PropTypes.func.isRequired,
      }),
    }),
    sys: PropTypes.shape({
      windowPara: PropTypes.shape({
        formType: PropTypes.string,
        edit: PropTypes.bool,
        connId: PropTypes.string.isRequired,
        nbId: PropTypes.string.isRequired,
        secId: PropTypes.string,
        noteId: PropTypes.string,
        layer: PropTypes.number.isRequired,
      }),
    }),
    user: PropTypes.shape({
      siteList: PropTypes.object.isRequired,
    }),
    share: PropTypes.shape({
      myContactList: PropTypes.array.isRequired,
      myPublicLinkInfo: PropTypes.shape({
        publicLink: PropTypes.array,
        existLink: PropTypes.array,
        passCode: PropTypes.string,
      }).isRequired,
      shareAccessList: PropTypes.array.isRequired,
    }),
    params: PropTypes.shape({
      siteId: PropTypes.string,
      sectionId: PropTypes.string,
      tagId: PropTypes.string,
      keyword: PropTypes.string,
    }).isRequired,
  };

  constructor(props) {
    super(props);
    const formType = ('formType' in props.sys.windowPara && props.sys.windowPara.formType) ? props.sys.windowPara.formType : 'normal';
    this.state = {
      type: formType,
      errMsg: {
        enable: false,
      },
    };
  }

  componentWillMount() {
    const {
      sys: {
        windowPara: { connId },
      },
      user: { siteList },
    } = this.props;
    const userSite = siteList[connId] ? (siteList[connId].user_site).toLowerCase() : null;
    const type = siteList[connId] ? (siteList[connId].type).toLowerCase() : null;

    if (this.props.share.myContactList.length === 0) {
      if ((userSite === 'cloud' && type !== 'nas') || type === 'cloud') this.props.actions.share.getMyContactList(connId);
      else if ((userSite === 'nas' && type !== 'cloud') || type === 'nas') this.props.actions.share.getNasUsers(connId);
    }
    if (this.props.share.myPublicLinkInfo.publicLink) this.props.actions.share.initPublicLink();
    this.props.actions.share.getAccessList(this.props.sys.windowPara);
  }

  componentWillUnmount() {
    this.props.actions.share.initShareInfo();
  }

  setBtnAction = () => {
    const {
      share: {
        myPublicLinkInfo: {
          publicLink,
          existLink,
        },
        shareAccessList,
      },
      actions: { sys: { setPopup } },
      params: { siteId, sectionId, tagId, keyword },
      note: {
          noteInfo: { id: noteId }
      }
    } = this.props;
    const path = this.props.location.pathname.split('/')[1];
    let pathData = {};

    switch (path) {
      case 'section':
        pathData = { siteId, sectionId, noteId};
        break;
      case 'tagNote':
        pathData = { siteId, tagId };
        break;
      case 'important':
        pathData = { siteId, noteId };
        break;
      case 'search':
        pathData = { siteId, noteId, keyword };
        break;
      default:
    }

    const btn = {
      apply: {},
      cancel: {
        enable: true,
        text: this.context.lang.btn_cancel,
        callback: () => {},
      },
    };

    switch (this.state.type) {
      case 'public':
        btn.apply = {
          enable: true,
          text: this.context.lang.btn_apply,
          callback: () => {
            const publicInfo = this.refs.sharePublicForm.getInfo();
            const { encrypt, password } = publicInfo;
            if (encrypt && password && password.length < 6) {
              this.setState({ errMsg: { enable: true, text: this.context.lang.window_encrypt_note_minimum } });
              return;
            }
            this.props.actions.share.setPublicLink(publicLink[0], publicInfo, this.props.sys.windowPara);
          },
        };
        if (!existLink || existLink.length === 0) {
          btn.cancel = {
            enable: true,
            text: this.context.lang.btn_cancel,
            callback: () => {
              const publicInfo = this.refs.sharePublicForm.getInfo();
              const { encrypt, password } = publicInfo;
              if (encrypt && password && password.length < 6) return;
              setPopup('ConfirmPublicPop', {
                ...this.props.sys.windowPara,
                publicInfo,
                publicLink: publicLink[0],
              });
            },
          };
        }
        break;
      case 'advanced':
        btn.apply = {
          enable: true,
          text: this.context.lang.btn_apply,
          callback: () => {
            const shareOtherList = this.refs.shareLabelForm.refs.labelForm.getList();
            const sharePermission = this.refs.shareLabelForm.refs.permissionSelect.getSelected();
            const accessList = this.refs.shareAdvancedForm.getAccessList();
            const isSame = accessList.length === shareAccessList.length && accessList.every((val, ind) => (val.email === shareAccessList[ind].email && +val.permission === +shareAccessList[ind].permission));

            if (this.existChecker(shareOtherList)) return;

            if (isSame) {
              if (shareOtherList.length === 0) {
                if (accessList.length === 0) this.setState({ errMsg: { enable: true, text: this.context.lang.window_share_empty_msg } });
                else this.setState({ errMsg: { enable: true, text: this.context.lang.window_share_nochange_msg } });
              } else {
                this.props.actions.share.setShareWithOthersToDB(shareOtherList, sharePermission, this.props.sys.windowPara, path, pathData);
              }
            } else {
              this.props.actions.share.setShareAccess(accessList, this.props.sys.windowPara, { shareOtherList, sharePermission }, path, pathData);
            }
          },
        };
        break;
      case 'nas-normal':
        btn.apply = {
          enable: true,
          text: this.context.lang.btn_apply,
          callback: () => {
          },
        };
        break;
      case 'normal':
      default:
        btn.apply = {
          enable: true,
          text: this.context.lang.btn_apply,
          callback: () => {
            const shareOtherList = this.refs.shareLabelForm.refs.labelForm.getList();
            const sharePermission = this.refs.shareLabelForm.refs.permissionSelect.getSelected();
            if (shareOtherList.length < 1) {
              this.setState({ errMsg: { enable: true, text: this.context.lang.window_share_empty_msg } });
              this.refs.shareLabelForm.refs.labelForm.refs.labelText.focus();
              return;
            }
            if (this.existChecker(shareOtherList)) return;
            this.props.actions.share.setShareWithOthersToDB(shareOtherList, sharePermission, this.props.sys.windowPara, path, pathData);
          },
        };
    }
    return btn;
  };

  goLink = () => {
    if (this.state.type !== 'public') {
      this.setState({ type: 'public', errMsg: { enable: false } });
    }
  };

  goAdvanced = () => {
    this.setState({ type: 'advanced', errMsg: { enable: false } });
  };

  existChecker = (shareOtherList) => {
    const {
      share: { shareAccessList },
    } = this.props;

    for (const ind in shareAccessList) {
      if (shareOtherList.indexOf(shareAccessList[ind].email) >= 0) {
        this.setState({
          errMsg: {
            enable: true,
            text: (<div>{this.context.lang.window_share_share_relationship_conflict} <u className="conflict-mail">{shareAccessList[ind].email}</u><br />{this.context.lang.window_share_share_authorization_conflict}</div>),
          },
        });
        return true;
      }
    }
    return false;
  };

  renderPublic = () => {
    if (this.state.type === 'advanced' && 'edit' in this.props.sys.windowPara && this.props.sys.windowPara.edit) return null; // for share list hide public link
    return (
      <div className="share-public" key="getPublicLink">
        <div className="public-btn" onClick={this.goLink}>
          <div className="icon-editor-link" />
          <div className="text"><u>{this.context.lang.window_share_public_get_public_link}</u></div>
        </div>
      </div>
    );
  };

  renderContent = () => {
    const {
      share: {
        myContactList,
        myPublicLinkInfo: {
          publicLink,
          publicTypeList,
          existLink,
          passCode,
        },
        shareAccessList,
      },
      sys: {
        windowPara,
        windowPara: { connId },
      },
      actions: {
        share: {
          createPublicLink,
        },
      },
      user: { siteList },
    } = this.props;
    const { lang } = this.context;
    const content = [];
    const shareMembers = [];
    let shareExist = lang.window_share_nas_share_with;

    for (let i = 0; i < shareAccessList.length; i++) {
      if (shareAccessList[i].type === '9') continue;
      const name = shareAccessList[i].email.split('@', 1)[0];
      shareMembers.push(name);
      if (shareMembers.length === 3) break;
    }
    shareExist += shareAccessList.length > 4 ? ` ${shareMembers.join(', ')} ${lang.window_share_with_others.replace('@', shareAccessList.length - 4)}` : ` ${shareMembers.join(', ')}`;

    const userSite = siteList[connId] ? (siteList[connId].user_site).toLowerCase() : null;
    const type = siteList[connId] ? (siteList[connId].type).toLowerCase() : null;

    switch (this.state.type) {
      case 'public':
        content.push(
          <SharePublic
            key="sharePublicForm"
            ref="sharePublicForm"
            link={publicLink}
            typeList={publicTypeList}
            exist={(existLink && existLink !== null)}
            windowPara={windowPara}
            createPublicLink={createPublicLink}
            passCode={passCode}
          />
        );
        break;
      case 'advanced':
        content.push(
          <ShareAdvanced
            ref="shareAdvancedForm"
            key="shareAdvancedForm"
            title={lang.window_share_with_others_who_has_access}
            shareAccessList={shareAccessList}
            layer={windowPara.layer}
          />
        );
        content.push(
          <ShareLabelForm
            key="shareLabelForm"
            title={lang.window_share_with_others_member}
            ref="shareLabelForm"
            myContactList={myContactList}
            isNas={((userSite === 'nas' && type !== 'cloud') || type === 'nas')}
          />
        );
        break;
      case 'normal':
      default:
        content.push(
          <ShareLabelForm
            key="shareLabelForm"
            title={this.context.lang.window_share_with_others_member}
            ref="shareLabelForm"
            myContactList={myContactList}
            isNas={((userSite === 'nas' && type !== 'cloud') || type === 'nas')}
          />
        );
        if (shareAccessList.length > 1) {
          content.push(
            <div key="existShare" className="share-members">{shareExist}</div>
          );
        }
        content.push(
          <div key="shareAdvancedBtn" className="share-advanced">
            <div className="text" onClick={this.goAdvanced}>
              <u>{this.context.lang.window_share_with_others_advanced}</u>
            </div>
          </div>
        );
    }
    return content;
  };

  render() {
    const btn = this.setBtnAction();

    return (
      <Window
        type="share-other"
        title={this.context.lang.window_share_title}
        setWindow={this.props.actions.sys.setWindow}
        apply={btn.apply}
        cancel={btn.cancel}
        tabIndex={-1}
        errorMessage={this.state.errMsg}
      >
        {this.renderPublic()}
        {this.renderContent()}
      </Window>
    );
  }
}

export default ShareWithOthers;
