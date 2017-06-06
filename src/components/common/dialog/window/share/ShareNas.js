import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import InputText from '../../../inputText/InputText';
import LabelSelect from '../../../label/LabelSelect';
import DropDownMenu from '../../../dropdown/DropDownMenu';

class ShareNas extends React.Component {

  static propTypes = {
      users: PropTypes.object,
    };

  constructor(props) {
      super(props);
      this.state = {
          filter: '',
          selectList: []
        };
      this.menus = [
          {
            name: lang_dictionary.window_share_can_view,
            icon: 'icon-dialog-btn_menu_view_normal'
          },
          {
            name: lang_dictionary.window_share_can_edit,
            icon: 'icon-dialog-btn_menu_edit_normal'
          }
        ];

      this.users = [
          {
            name: 'yizheng',
            id: '1'
          },
          {
            name: 'chris lin',
            id: '12'
          },
          {
            name: 'LH',
            id: '13'
          },
          {
            name: 'Dora Chen',
            id: '14'
          },
          {
            name: 'yizheng',
            id: '15'
          },
          {
            name: 'chris lin',
            id: '16'
          },
          {
            name: 'LH',
            id: '17'
          },
          {
            name: 'Dora Chen',
            id: '19'
          },
        ];
    }

  handleChange = (e) => {
      this.setState({ filter: e.target.value });
    };

  handleClear = (e) => {
      this.setState({ filter: '' });
    };

  handleSelect = (e, props) => {
      const { id, checked } = props;

      let { selectList } = this.state;
      const index = selectList.indexOf(id);
      if (!checked && index < 0) {
          selectList.push(id);
          this.setState({ selectList: selectList });
        }
      if (checked && index > -1) {
          selectList.splice(index, 1);
          this.setState({ selectList: selectList });
        }
    };

  renderUser = () => {
        // const {users} = this.props;
      const { filter } = this.state;
      return this.users.map((value, index) => {
          if (value.name.indexOf(filter) < 0)
              return;
          return (
                <LabelSelect key={`user-${index}`} id={value.id} name={value.name} checked={this.state.selectList.indexOf(value.id) >= 0} change={this.handleSelect.bind(this)} />
            );
        });
    };

  getSelect = () => {
      return this.state.selectList;
    };

  render() {
    	  return (
	        <div className="share-nas-form">
                <div className="content-title">
                    <div className="title-box">
                        <div>{lang_dictionary.window_share_nas_share_with}</div>
                        <div>{lang_dictionary.window_share_nas_share_invite_msg}</div>
                    </div>
                    <div className="filter-box">
                        <InputText ref="searchInput" change={this.handleChange} clear={this.handleClear} filter />
                    </div>
                </div>
                <div className="content-box">
                    {this.renderUser()}
                </div>
                <div className="menu-box">
                    <DropDownMenu menus={this.menus}
                      ref='permissionSelect'
     />
                </div>
            </div>
        );
    }
}

export default ShareNas;
