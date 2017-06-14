'use strict'

// React
import React from 'react';

// Navigation
import { addNavigationHelpers, NavigationActions } from 'react-navigation';
import { TabBar } from '../navigationConfiguration';
import { BackHandler, BackAndroid } from 'react-native'; 
// Redux
import { connect } from 'react-redux';
// FCM
import FCM, {FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType} from 'react-native-fcm';
const mapStateToProps = (state) => {
 return {
  navigationState: state.tabBar,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      //note: bindActionCreators(NoteActions, dispatch),
    },
    dispatch,
  };
}

class TabBarNavigation extends React.Component {
  componentDidMount() {
    FCM.requestPermissions(); // for iOS
    FCM.getFCMToken().then(token => {
        // console.log(token)
        // store fcm token in your server
    });
    this.notificationListener = FCM.on(FCMEvent.Notification, async (notif) => {
        //alert('I recevied a message');
        // there are two parts of notif. notif.notification contains the notification payload, notif.data contains data payload
        if(notif.local_notification){
          //this is a local notification
        }
        if(notif.opened_from_tray){
          //app is open/resumed because user clicked banner
        }
        //await someAsyncCall();
        if (notif && notif.local) {
          return;
        }
        FCM.presentLocalNotification({
          title: notif.title,
          body: notif.body,
          priority: "high",
          click_action: notif.click_action,
          show_in_foreground: true,
          local: true,
          vibrate: 300, 
          number: 10, // Android only
          color: "red",
        });
        /*
        if(Platform.OS ==='ios'){
          //optional
          //iOS requires developers to call completionHandler to end notification process. If you do not call it your background remote notifications could be throttled, to read more about it see the above documentation link. 
          //This library handles it for you automatically with default behavior (for remote notification, finish with NoData; for WillPresent, finish depend on "show_in_foreground"). However if you want to return different result, follow the following code to override
          //notif._notificationType is available for iOS platfrom
          switch(notif._notificationType){
            case NotificationType.Remote:
              notif.finish(RemoteNotificationResult.NewData) //other types available: RemoteNotificationResult.NewData, RemoteNotificationResult.ResultFailed
              break;
            case NotificationType.NotificationResponse:
              notif.finish();
              break;
            case NotificationType.WillPresent:
              notif.finish(WillPresentNotificationResult.All) //other types available: WillPresentNotificationResult.None
              break;
          }
        }*/
    });
    this.refreshTokenListener = FCM.on(FCMEvent.RefreshToken, (token) => {
        // console.log(token);
        // fcm token may not be available on first load, catch it here
    });
    BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
  }
  componentWillUnmount() {
    this.notificationListener.remove();
    this.refreshTokenListener.remove();
    BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
  }
  onBackPress = () => {
    if (this.props.navigationState.index) {
      this.props.dispatch({type: "Navigation/BACK"})
      return true;
    } else {
      return false;
    }
  };
  render(){
    const { dispatch, navigationState } = this.props
    return (
      <TabBar
        navigation={
          addNavigationHelpers({
            dispatch: dispatch,
            state: navigationState,
          })
        }
      />
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TabBarNavigation);


