import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';

class ItemMenu extends React.Component {

  static contextTypes = {
    router: PropTypes.object.isRequired,
    lang: PropTypes.object.isRequired,
    envPlatform: PropTypes.string.isRequired,
  };

  static propTypes = {
    over: PropTypes.func.isRequired,
    blur: PropTypes.func.isRequired,
    initItemMenu: PropTypes.func.isRequired,
    actions: PropTypes.shape().isRequired,
  };

  constructor(props, context) {
    super(props);

    this.state = {
      /** data format
        data: {
            top,                    item offsetTop
            left,                   item offsetLeft
            width,                  item width
            itemHeight,             item height
            menuWidth,              menu width
            menuHeight,             menu height
            containerHeight,        list container height
            scrollTop               list container scrollTop
            ...other                item data
        }
      **/
      data: {},
    };

    this.options = {
      site: [
        {
          title: context.lang.dropdown_add_notebook,
          action: 10001,
          type: 'add',
        },
        {
          title: context.lang.dropdown_unmount,
          action: 10002,
          type: 'unmount',
        },
      ],
      notebook: [
        {
          title: context.lang.dropdown_add_section,
          action: 20001,
          type: 'add',
        },
        {
          title: context.lang.dropdown_rename,
          action: 20002,
          type: 'rename',
        },
        {
          title: context.lang.general_delete,
          action: 20003,
          type: 'delete',
        },
        {
          title: context.lang.dropdown_share,
          action: 20004,
          type: 'share',
        },
        {
          title: context.lang.dropdown_sync,
          action: 20005,
          type: 'sync',
        },
          // {
          //     title: context.lang.dropdown_export_notebook,
          //     action: 20006,
          //     type: 'notebook'
          // },
        {
          title: context.lang.dropdown_export_pdf,
          action: 20007,
          type: 'pdf',
        },
      ],
      section: [
        {
          title: context.lang.dropdown_add_note,
          action: 30001,
          type: 'add',
        },
        {
          title: context.lang.dropdown_rename,
          action: 30002,
          type: 'rename',
        },
        {
          title: context.lang.general_delete,
          action: 30003,
          type: 'delete',
        },
        {
          title: context.lang.dropdown_share,
          action: 30004,
          type: 'share',
        },
          // {
          //     title: context.lang.dropdown_export_section,
          //     action: 30005,
          //     type: 'section'
          // },
        {
          title: context.lang.dropdown_export_pdf,
          action: 30006,
          type: 'pdf',
        },
        {
          title: context.lang.general_move_to,
          action: 30007,
          type: 'move',
        },
      ],
      note: [
        // {
        //     title: context.lang.dropdown_rename,
        //     action: 40001,
        //     type: 'rename'
        // },
        {
          title: context.lang.general_delete,
          action: 40002,
          type: 'delete',
        },
        {
          title: context.lang.general_duplicate,
          action: 40007,
          type: 'duplicate',
        },
        {
          title: context.lang.dropdown_share,
          action: 40003,
          type: 'share',
        },
        // {
        //     title: context.lang.dropdown_add_tag,
        //     action: 40004,
        //     type: 'tag'
        // },
        // {
        //     title: context.lang.dropdown_export_note,
        //     action: 40004,
        //     type: 'note'
        // },
        {
          title: context.lang.dropdown_export_pdf,
          action: 40005,
          type: 'pdf',
        },
        {
          title: context.lang.general_move_to,
          action: 40006,
          type: 'move',
        },
      ],
      tag: [
        {
          title: context.lang.dropdown_rename,
          action: 50001,
          type: 'rename',
        },
        {
          title: context.lang.general_delete,
          action: 50002,
          type: 'delete',
        },
      ],
      trashcan: [
        {
          title: context.lang.dropdown_trashcan_empty,
          action: 60001,
          type: 'delete',
        },
        {
          title: context.lang.dropdown_trashcan_restore_all,
          action: 60002,
          type: 'restore',
        },
      ],
      trashNote: [
        {
          title: context.lang.general_delete,
          action: 70001,
          type: 'delete',
        },
        {
          title: context.lang.general_restore,
          action: 70002,
          type: 'restore',
        },
      ],
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.data === this.state.data) return false;
    return true;
  }

  componentDidUpdate() {
    const self = ReactDOM.findDOMNode(this);
    if (Object.keys(this.state.data).length !== 0) {
      ReactDOM.findDOMNode(this).focus();
      if (!('menuHeight' in this.state.data)) {
        this.setState({
          data: {
            ...this.state.data,
            menuWidth: self.offsetWidth,
            menuHeight: self.offsetHeight,
          },
        });
      }
    }
  }

  setData = (data) => {
    this.setState({ data });
  };

  setMenuState = () => {
    const { data: { left, width, itemHeight, menuWidth, menuHeight, containerHeight, scrollTop } } = this.state;
    let { data: { top } } = this.state;
    if ((top + menuHeight) > containerHeight) {
      top -= (menuHeight + itemHeight);
    }
    return {
      left: left + width - menuWidth,
      top: top + scrollTop,
      visibility: 'visible',
    };
  };

  setItems = () => {
    const {
      data: {
          type,
          connId,
          subType,
          shareInfo,
      },
    } = this.state;
    const option = this.options[type];
    const items = [];

    for (const index in option) {
      if (type === 'site' && subType === 'Default' && option[index].type === 'unmount') continue;
      if (type === 'notebook' && option[index].type === 'sync' && connId !== 'local') continue;
      if (type === 'notebook' && option[index].type === 'sync') continue;
      if (shareInfo && +shareInfo.type === 2) {
        if (option[index].type === 'move' || option[index].type === 'sync') continue;
        if (type === 'notebook' && +shareInfo.level === 3 && option[index].type === 'delete') continue;
        else if (type === 'section' && +shareInfo.level === 2 && option[index].type === 'delete') continue;
        else if (type === 'note' && +shareInfo.level === 1 && (option[index].type === 'delete' || option[index].type === 'duplicate')) continue;
      }
      items.push(<div className={`item-${option[index].type}`} key={index} onClick={this.handleClick.bind(this, option[index])}>{option[index].title}</div>);
    }

    return items;
  };

  handleClick = (itemOption) => {
    const {
      data,
      data: {
        shareInfo,
        owner,
      },
    } = this.state;
    const shareType = (shareInfo && shareInfo.type) ? shareInfo.type : null;
    const {
        actions,
        actions: { sys: { setGAEvent } },
    } = this.props;
    const { lang } = this.context;
    let action = '';
    let popType = '';
    let title = '';
    let message = '';
    let para = null;

    switch (itemOption.action) {
      case 10001:
        action = 'add';
        popType = data.type;
        para = {
          id: data.id,
          num: Object.keys(data.list).length,
          connId: data.connId,
        };
        setGAEvent('SidebarMenu', 'add', 'notebook');
        break;
      case 10002:
        action = 'popup';
        popType = 'UnMount';
        para = {
          id: data.id,
          connId: data.connId,
          name: data.name,
        };
        setGAEvent('SidebarMenu', 'unmount', 'side');
        break;
      case 20001:
        action = 'add';
        popType = data.type;
        para = {
          id: data.id,
          num: Object.keys(data.list).length,
          connId: data.connId,
        };
        setGAEvent('SidebarMenu', 'add', 'section');
        break;
      case 20002:
        action = 'rename';
        popType = data.type;
        para = {
          id: data.id,
          connId: data.connId,
        };
        setGAEvent('SidebarMenu', 'rename', 'notebook');
        break;
      case 20003:
        action = 'popup';
        popType = 'DeletePop';
        para = {
          id: data.id,
          name: data.name,
          type: data.type,
          connId: data.connId,
        };
        if (+shareType === 2) para.shareOwner = owner.split('@', 1)[0];
        setGAEvent('SidebarMenu', 'delete', 'notebook');
        break;
      case 20004:
        action = 'window';
        popType = 'ShareWithOthers';
        para = {
          nbId: data.id,
          layer: 3,
          connId: data.connId,
        };
        setGAEvent('SidebarMenu', 'share', 'notebook');
        break;
      case 20005:
        action = 'window';
        popType = 'SetSync';
        para = {
          nbId: data.id,
          connId: data.connId,
          sync: +data.sync,
        };
        break;
      case 20006:
        action = '';
        popType = '';
        title = '';
        message = '';
        para = {};
        break;
      case 20007:
        action = 'popup';
        popType = 'CommonPop';
        para = {
          typeIcon: 'info',
          title: lang.dropdown_export_pdf,
          msg: `${lang.dropdown_export_pdf} - ${lang.general_notebook}: ${data.name} ?`,
          confirmCallback: () => {
            actions.export.exportByDownload({
              connId: data.connId,
              file_type: 'pdf',
              file_list: data.id,
            });
          },
        };
        setGAEvent('SidebarMenu', 'export', 'pdf');
        break;
      case 30001:
        action = 'add';
        popType = data.type;
        para = {
          id: data.id,
          nbId: data.nbId,
          connId: data.connId,
          callback: this.context.router.push.bind(this, `/section/${data.connId}/${data.id}`),
        };
        setGAEvent('SidebarMenu', 'add', 'note');
        break;
      case 30002:
        action = 'rename';
        popType = data.type;
        para = {
          id: data.id,
          nbId: data.nbId,
          connId: data.connId,
        };
        setGAEvent('SidebarMenu', 'rename', 'section');
        break;
      case 30003:
        action = 'popup';
        popType = 'DeletePop';
        para = {
          id: data.id,
          nbId: data.nbId,
          name: data.name,
          type: data.type,
          connId: data.connId,
        };
        if (+shareType === 2) para.shareOwner = owner.split('@', 1)[0];
        setGAEvent('SidebarMenu', 'delete', 'section');
        break;
      case 30004:
        action = 'window';
        popType = 'ShareWithOthers';
        para = {
          nbId: data.nbId,
          secId: data.id,
          layer: 2,
          connId: data.connId,
        };
        setGAEvent('SidebarMenu', 'share', 'section');
        break;
      case 30005:
        action = '';
        popType = '';
        title = '';
        message = '';
        para = {};
        break;
      case 30006:
        action = 'popup';
        popType = 'CommonPop';
        para = {
          typeIcon: 'info',
          title: lang.dropdown_export_pdf,
          msg: `${lang.dropdown_export_pdf} - ${lang.general_section}: ${data.name} ?`,
          confirmCallback: () => {
            actions.export.exportByDownload({
              connId: data.connId,
              file_type: 'pdf',
              export_type: 'section',
              file_list: data.id,
            });
          },
        };
        setGAEvent('SidebarMenu', 'export', 'pdf section');
        break;
      case 30007:
        action = 'window';
        popType = 'MoveTo';
        para = {
          nbId: data.nbId,
          secId: data.id,
          type: data.type,
          connId: data.connId,
        };
        setGAEvent('SidebarMenu', 'moveto', 'section');
        break;
      case 40001:
        action = 'rename';
        popType = data.type;
        para = {
          id: data.id,
          connId: data.connId,
        };
        setGAEvent('SidebarMenu', 'rename', 'note');
        break;
      case 40002:
        action = 'popup';
        popType = 'DeletePop';
        para = {
          id: data.note_id,
          secId: data.sec_id,
          tagId: 'tag_id' in data ? data.tag_id : null,
          name: data.note_name,
          type: 'note',
          subType: 'subType' in data ? data.subType : null,
          connId: data.connId,
        };
        if (+shareType === 2) para.shareOwner = owner.split('@', 1)[0];
        setGAEvent('SidebarMenu', 'delete', 'note');
        break;
      case 40003:
        action = 'window';
        popType = 'ShareWithOthers';
        para = {
          nbId: data.nb_id,
          secId: data.sec_id,
          noteId: data.note_id,
          layer: 1,
          connId: data.connId,
        };
        setGAEvent('SidebarMenu', 'share', 'note');
        break;
      case 40004:
        action = 'window';
        popType = 'AddTag';
        para = {
          note_id: data.note_id,
        };
        break;
      case 40005:
        action = 'popup';
        popType = 'CommonPop';
        para = {
          typeIcon: 'info',
          title: lang.dropdown_export_pdf,
          msg: `${lang.dropdown_export_pdf} - ${lang.general_note}: ${data.note_name} ?`,
          confirmCallback: () => {
            actions.export.exportByDownload({
              connId: data.connId,
              file_type: 'pdf',
              export_type: 'note',
              file_list: data.note_id,
            });
          },
        };
        setGAEvent('SidebarMenu', 'export', 'pdf note');
        break;
      case 40006:
        action = 'window';
        popType = 'MoveTo';
        para = {
          noteId: data.note_id,
          secId: data.sec_id,
          nbId: data.nb_id,
          type: 'note',
          connId: data.connId,
        };
        setGAEvent('SidebarMenu', 'moveto', 'note');
        break;
      case 40007:
        action = 'popup';
        popType = 'CommonPop';
        para = {
          typeIcon: 'remind',
          title: lang.popup_duplicate_title,
          msg: `${lang.popup_duplicate_msg}${lang.general_note}: ${data.note_name}?`,
          confirmCallback: () => {
            actions.note.setDuplicate(data.connId, data.nb_id, data.sec_id, data.note_id);
          },
        };
        setGAEvent('SidebarMenu', 'duplicate', 'note');
        break;
      case 50001:
        action = 'renameTag';
        popType = data.type;
        para = {
          id: data.id,
          connId: data.connId,
          name: data.name,
        };
        setGAEvent('SidebarMenu', 'rename', 'tag');
        break;
      case 50002:
        action = 'popup';
        popType = 'DeletePop';
        para = {
          id: data.id,
          name: data.name,
          type: data.type,
          connId: data.connId,
        };
        setGAEvent('SidebarMenu', 'delete', 'tag');
        break;
      case 60001:
        action = 'popup';
        popType = 'CommonPop';
        para = {
          typeIcon: 'delete',
          title: lang.dropdown_trashcan_empty,
          msg: lang.popup_force_delete_all_msg,
          confirmCallback: () => {
            actions.note.emptyTrashcan(data.connId);
          },
        };
        setGAEvent('SidebarMenu', 'delete', 'all trash');
        break;
      case 60002:
        action = 'popup';
        popType = 'CommonPop';
        para = {
          typeIcon: 'remind',
          title: lang.dropdown_trashcan_restore_all,
          msg: lang.popup_restore_all_msg,
          confirmCallback: () => {
            actions.note.restoreTrashcan(data.connId);
          },
        };
        setGAEvent('SidebarMenu', 'restore', 'all trash');
        break;
      case 70001:
        action = 'popup';
        popType = 'CommonPop';
        para = {
          typeIcon: 'delete',
          title: `${lang.general_delete}${lang.general_note}`,
          msg: `${lang.popup_force_delete_msg}${lang.general_note}: ${data.note_name} ?`,
          confirmCallback: () => {
            actions.note.deleteNoteFromTrashcan(data.note_id, data.connId);
          },
        };
        setGAEvent('SidebarMenu', 'delete', 'trash note');
        break;
      case 70002:
        action = 'popup';
        popType = 'CommonPop';
        para = {
          connId: data.connId,
          noteId: data.note_id,
          typeIcon: 'remind',
          title: `${lang.general_restore}${lang.general_note}`,
          msg: `${lang.popup_restore_msg}${lang.general_note}: ${data.note_name} ?`,
          confirmCallback: () => {
            actions.note.restoreNoteFromTrashcan(
              data.note_id,
              data.connId,
              () => {
                this.context.router.push(`/section/${data.connId}/${data.sec_id}/${data.note_id}`);
              }
            );
          },
        };
        setGAEvent('SidebarMenu', 'restore', 'trash note');
        break;
      default:
        break;
    }

    // handle default
    if ((data.isDefault && +data.isDefault === 1) || (data.is_default && +data.is_default === 1)) {
      switch (itemOption.type) {
        case 'delete':
        case 'move':
          actions.sys.setPopup('CommonPop', {
            typeIcon: 'warning',
            title: lang.general_default_reject,
            msg: lang.general_default_reject,
            confirmOnly: true,
          });
          this.props.initItemMenu(this);
          return;
        default:
          break;
      }
    }

    if (action && para) {
      actions.sys.setItemMenuAction(action, popType, para);
      this.props.initItemMenu(this);
    }
  };

  render() {
    let style = [];
    let items = [];
    if ('type' in this.state.data) {
      items = this.setItems();
      if ('menuHeight'in this.state.data) style = this.setMenuState();
    }

    return (
      <div className="sidebar-item-menu" tabIndex={-1} style={style} onMouseOver={e => this.props.over(e, this)} onBlur={e => this.props.blur(e, this)}>
        {items}
      </div>
    );
  }
}

export default ItemMenu;
