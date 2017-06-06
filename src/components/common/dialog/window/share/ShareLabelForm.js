import React, { PropTypes } from 'react';
import LabelForm from '../../../label/LabelForm';
import DropDownMenu from '../../../dropdown/DropDownMenu';

class ShareLabelForm extends React.Component {

  static contextTypes = {
    lang: PropTypes.object.isRequired,
  };

  static propTypes = {
    title: PropTypes.string,
    myContactList: PropTypes.array,
    isNas: PropTypes.bool,
  };

  constructor(props, context) {
    super(props);
    this.state = {
      selected: 0,
    };
    this.menus = [
      {
        name: context.lang.window_share_can_edit || 'Can edit',
        value: 2,
      },
      {
        name: context.lang.window_share_can_view || 'Can view',
        value: 1,
      },
    ];
  }

  render() {
    const { title, myContactList, isNas } = this.props;
    const { lang } = this.context;
    const placeholder = isNas ? lang.window_share_placeholder_sharing_member_nas : lang.window_share_placeholder_sharing_member;

    return (
      <div className="share-label-form">
        <div className="content-title">{title}</div>
        <div className="content-box">
          <LabelForm
            ref="labelForm"
            placeholder={placeholder}
            relations={myContactList}
            mailParser
          />
          <DropDownMenu
            menus={this.menus}
            ref="permissionSelect"
          />
        </div>
      </div>
    );
  }
}

export default ShareLabelForm;
