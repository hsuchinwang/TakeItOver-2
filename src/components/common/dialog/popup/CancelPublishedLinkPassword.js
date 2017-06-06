import { PropTypes } from 'react';
import Alert from './share/Alert';
import { transferString } from '../../../../common/Utils';
export default class CancelPublishedLinkPassword extends Alert {
  static propTypes = {
    actions: PropTypes.shape({
      share: PropTypes.shape({
        cancelPublishedLinkPassword: PropTypes.func.isRequired
      }),
      sys: PropTypes.shape({
        setPopup: PropTypes.func.isRequired
      })
    }),
    share: PropTypes.object.isRequired,
    sys: PropTypes.shape({
      popPara: PropTypes.shape({
        checkedIds: PropTypes.array.isRequired,
        clearSelectedItem: PropTypes.func.isRequired
      })
    })
  };

  className = 'cancelPublishedLinkPassword';

  title = lang_dictionary.btn_cancel_password;

  constructor(props) {
    super(props);
    this.list = [];
    this.selectSubmitData = {};
  }

  componentWillMount() {
    const { share, sys: { popPara: { checkedIds } } } = this.props;
    share['publishedLinkList'].forEach(item => {
      const { id, submitData, sourceId, displayData } = item;
      if (checkedIds.indexOf(id) != -1) {
        if (item.sourceId in this.selectSubmitData) {
          this.selectSubmitData[sourceId].push(submitData);
        } else {
          this.selectSubmitData[sourceId] = [];
          this.selectSubmitData[sourceId].push(submitData);
        }
        this.list.push(displayData.name);
      }
    });
  }

  getDescription = () => {
    return transferString(lang_dictionary.popup_share_cancel_password_title, { num: this.list.length });
  };

  handleConfirm = () => {
    const { actions, sys: { popPara: { type, clearSelectedItem } } } = this.props;
    actions.share.cancelPublishedLinkPassword(this.selectSubmitData);
    clearSelectedItem();
  };
}
