import React, { PropTypes } from 'react';
import DropDownMenu from '../../../dropdown/DropDownMenu';

class ShareAdvancedItem extends React.Component {

  static contextTypes = {
    lang: PropTypes.object.isRequired,
  };

  static propTypes = {
    people: PropTypes.object.isRequired,
    edit: PropTypes.bool.isRequired,
    change: PropTypes.func.isRequired,
    del: PropTypes.func.isRequired,
  };

  constructor(props, context) {
    super(props);
    this.menus = [
      {
        name: context.lang.window_share_can_view || 'Can view',
        icon: 'icon-dialog-btn_menu_view_normal',
      },
      {
        name: context.lang.window_share_can_edit || 'Can edit',
        icon: 'icon-dialog-btn_menu_edit_normal',
      },
      // {
      //   name: this.context.lang.window_share_can_share || 'Can share',
      //   icon: 'icon-dialog-btn_menu_edit_normal'
      // }
    ];
  }

  render() {
    const {
      change,
      del,
      edit,
      people: {
        icon,
        email,
        permission,
        type,
      },
    } = this.props;
    const { lang } = this.context;

    let displayName = email;
    if (!edit || (edit && +type === 9)) {
      switch (type) {
        case '1':
          displayName += ` (${lang.window_share_inherited_note})`;
          break;
        case '2':
          displayName += ` (${lang.window_share_inherited_section})`;
          break;
        case '3':
          displayName += ` (${lang.window_share_inherited_notebook})`;
          break;
        case '9':
          displayName += ` (${lang.window_share_owner})`;
          break;
        default:
      }
    }

    return (
      <div className="share-advanced-item">
        <div className="icon">
          <div className={icon || 'icon-common-ic_user'} />
        </div>
        <div className="name" title={displayName}>{displayName}</div>
        <div className="permission">
          {
            edit && type < 9 ?
              <DropDownMenu menus={this.menus} selected={permission - 1} onchange={index => change(this, index + 1)} normal /> :
              <div className="read-only">{this.menus[permission - 1].name}</div>
          }
        </div>
        <div className="delete">
          { edit && type < 9 ? <div className="delete-btn" onClick={e => del(e, this)} /> : null }
        </div>
      </div>
    );
  }
}

export default ShareAdvancedItem;
