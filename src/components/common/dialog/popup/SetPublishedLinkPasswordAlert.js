import { PropTypes } from 'react';
import Alert from './share/Alert';
import { transferString } from '../../../../common/Utils';

export default class SetPublishedLinkPasswordAlert extends Alert {
  static propTypes = {
    actions: PropTypes.shape({
      sys: PropTypes.shape({
        setPopup: PropTypes.func.isRequired,
        setWindow: PropTypes.func.isRequired,
      })
    }),
    sys: PropTypes.shape({
      popPara: PropTypes.shape({
        selectItemTotal: PropTypes.number.isRequired,
        selectSubmitData: PropTypes.array.isRequired,
        hasPasswordItems: PropTypes.array.isRequired,
        clearSelectedItem: PropTypes.func.isRequired
      })
    })
  };

  className = 'setPublishedLinkPasswordAlert';

  title = lang_dictionary.btn_set_password;

  constructor(props) {
    super(props);
    this.list = props.sys.popPara.hasPasswordItems;
  }

  getDescription = () => {
    const {
      sys:{
        popPara: { hasPasswordItems, selectItemTotal }
      }
    } = this.props;
    return transferString(lang_dictionary.popup_share_set_password_title, { choseNum: selectItemTotal, setNum: hasPasswordItems.length });
  };

  handleConfirm = () => {
    const { actions, sys: { popPara: { clearSelectedItem, selectSubmitData } } } = this.props;
    actions.sys.setWindow('SetPublishedLinkPassword', null, { clearSelectedItem, selectSubmitData });
  };
}
