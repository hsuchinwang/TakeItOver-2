import { PropTypes } from 'react';
import Alert from './share/Alert';
import { transferString } from '../../../../common/Utils';

export default class StopShare extends Alert {

  static propTypes = {
    actions: PropTypes.shape({
      share: PropTypes.shape({
        stopShare: PropTypes.func.isRequired,
      }),
      sys: PropTypes.shape({
        setPopup: PropTypes.func.isRequired,
      }),
    }),
    share: PropTypes.object.isRequired,
    sys: PropTypes.shape({
      popPara: PropTypes.shape({
        checkedIds: PropTypes.array.isRequired,
        type: PropTypes.string.isRequired,
        clearSelectedItem: PropTypes.func.isRequired,
      }),
    }),
  };

  constructor(props, context) {
    super(props);
    this.list = [];
    this.selectSubmitData = {};
    this.className = 'stopShare';
    this.title = context.lang.btn_stop_sharing;
  }

  componentWillMount() {
    const { share, sys: { popPara: { checkedIds, type } } } = this.props;
    share[`${type}List`].forEach(item => {
      const { id, submitData, sourceId, displayData } = item;
      if (checkedIds.indexOf(id) > -1) {
        if (sourceId in this.selectSubmitData) {
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
    const { sys: { popPara: { type } } } = this.props;
    return transferString(this.context.lang[`popup_share_stop_sharing_title_${type}`], { num: this.list.length });
  };

  handleConfirm = () => {
    const { actions, sys: { popPara: { type, clearSelectedItem } } } = this.props;
    actions.share.stopShare(this.selectSubmitData, type);
    clearSelectedItem();
  };
}
