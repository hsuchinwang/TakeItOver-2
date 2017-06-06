'use strict'
import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, RefreshControl, ScrollView, Platform } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome';
import FCM, {FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType} from 'react-native-fcm';

export default class TabOneScreenOne extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isRefreshing: false,
      board: '歡迎進入奇妙的世界！'
    };
  }
  _onRefresh() {
    this.setState({isRefreshing: true});
    setTimeout(() => {
      this.setState({isRefreshing: false});
    },500);
  }

  static navigationOptions = ({ navigation }) => {
    return {
      visible: false,
      title:'首頁',
      headerTitleStyle:{
        alignSelf: 'center',
        marginLeft: -20,
      },
      headerLeft: (
        <Ionicons.Button name="ios-menu" color="#185ffe" style={{marginLeft:13}}backgroundColor="#eeeef2" onPress={() => navigation.navigate('DrawerOpen')}>
        </Ionicons.Button>
      ),
      drawerLabel: '首頁',
      drawerIcon: ({ tintColor }) => (
        <Ionicons
          name={'md-home'}
          size={Platform == 'ios' ? 26 : 20}
          style={{ color: tintColor }}
        />
      ),
    }
  };
  componentDidMount() {
    FCM.on(FCMEvent.Notification, async (notif) => {
      console.log(notif);
      //Platform.OS()
      alert('I recevied a message:');
      // this.setState({
      //   board: notif.notification.body,
      // });
      FCM.presentLocalNotification({
          id: "UNIQ_ID_STRING",                               // (optional for instant notification)
          title: "My Notification Title",                     // as FCM payload
          body: "My Notification Message",                    // as FCM payload (required)
          sound: "default",                                   // as FCM payload
          priority: "high",                                   // as FCM payload
          click_action: "ACTION",                             // as FCM payload
          badge: 10,                                          // as FCM payload IOS only, set 0 to clear badges
          number: 10,                                         // Android only
          ticker: "My Notification Ticker",                   // Android only
          auto_cancel: true,                                  // Android only (default true)
          large_icon: "ic_launcher",                           // Android only
          icon: "ic_launcher",                                // as FCM payload, you can relace this with custom icon you put in mipmap
          big_text: "Show when notification is expanded",     // Android only
          sub_text: "This is a subText",                      // Android only
          color: "red",                                       // Android only
          vibrate: 300,                                       // Android only default: 300, no vibration if you pass null
          tag: 'some_tag',                                    // Android only
          group: "group",                                     // Android only
          my_custom_data:'my_custom_field_value',             // extra data you want to throw
          lights: true,                                       // Android only, LED blinking (default false)
          show_in_foreground                                  // notification when app is in foreground (local & remote)
       });
    });
  }
  render() {
    return(
      <View
        style={{
          flex:1,
          backgroundColor:'aqua',
          alignItems:'center',
          justifyContent:'center'
        }}>
        <ScrollView
          style={styles.contentContainer}     
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={this._onRefresh.bind(this)}
              //tintColor="#ff0000"
              title="Loading..."
              //titleColor="#00ff00"
              //colors={['#ff0000', '#00ff00', '#0000ff']}
              //progressBackgroundColor="#ffff00"
            />
          }
        >
          <Text style={styles.text}>{this.state.board}</Text>
          <TouchableOpacity
            onPress={ () => this.props.navigation.navigate('TabOneDrawerTwo') }
            style={{
              padding:20,
              borderRadius:20,
              backgroundColor:'yellow',
              marginTop:20
            }}>
            <Text>{'Go to next screen this tab'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={ () => {
              FCM.getFCMToken().then(token => {
                console.log(token);
                alert(token);
              });
            }}
            style={{
              padding:20,
              borderRadius:20,
              backgroundColor:'white',
              marginTop:20
            }}>
            <Text>{'dispatch Action Go to next screen this tab'}</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  text: {
    textAlign: 'center',
    color: 'red',
    backgroundColor: 'rgba(0,0,0,0)',
    fontSize: 32
  },
  contentContainer: {
    paddingVertical: 1,
    marginTop: Platform.OS == 'ios' ? 25 : 0,
  },
});