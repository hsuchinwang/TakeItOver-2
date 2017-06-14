'use strict'
import React from 'react';
import { 
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  RefreshControl,
  ScrollView,
  Platform,
  TextInput,
  Button,
  AsyncStorage,
  Dimensions,
} from 'react-native';
import * as Config from '../../constants/config';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome';
import FCM, {FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType} from 'react-native-fcm';

const { width, height } = Dimensions.get("window");
async function getFlagFromSetting() {
    let response = await fetch(`http://${Config.SERVER_IP}:${Config.PORT}/get_setting`)
    .then((response) => response.json())
    .catch((error) => {
      console.error(error);
      return error;
    });
    return response[0];
}
async function getMyUser() {
  const username = await AsyncStorage.getItem('@UserName');
    let response = await fetch(
      `http://${Config.SERVER_IP}:${Config.PORT}/get_my_user`,
      {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
        body: JSON.stringify({
          'name': username,
        })
     }
    )
    .then((response) => response.json())
    .catch((error) => {
      console.error(error);
      return error;
    });
    return response[0];
}
async function getMyCountry() {
  const userCountry = await AsyncStorage.getItem('@UserCountry');
    let response = await fetch(
      `http://${Config.SERVER_IP}:${Config.PORT}/get_my_country`,
      {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
        body: JSON.stringify({
          'country': userCountry,
        })
     }
    )
    .then((response) => response.json())
    .catch((error) => {
      console.error(error);
      return error;
    });
    return response[0];
}
export default class TabOneScreenOne extends React.Component {
  constructor(props) {
    super(props);
    this.init();
    this.state = {
      isRefreshing: false,
      board: '',
      country: '',
      K: 0,
      water: 0,
      fire: 0,
      wood: 0,
      stone: 0,
      seed: 0,
    };
  }
  async init() {
    const table_flag = await getFlagFromSetting();
    if (table_flag.changeToDay3 == 'T') {
      const country = await getMyCountry();
      this.setState({
        K: country.K,
        water: country.water,
        fire: country.fire,
        wood: country.wood,
        stone: country.stone,
        seed: country.seed,
        isRefreshing: false
      });
    } else {
      const user = await getMyUser();
      this.setState({
        K: user.K,
        water: user.water,
        fire: user.fire,
        wood: user.wood,
        stone: user.stone,
        seed: user.seed,
        isRefreshing: false
      });
    }
  }
  _onRefresh() {
    this.setState({isRefreshing: true});
    this.init();
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
        <Ionicons.Button 
          name="ios-menu"
          color="#185ffe"
          style={{marginLeft:13}} 
          backgroundColor="#eeeef2"
          onPress={
            () => navigation.navigate('DrawerOpen')
          }>
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
      // console.log(notif);
      //Platform.OS()
      // alert('I recevied a message:');
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
    console.log(this.state);
    return(
      <View
        style={{
          flex:1,
          backgroundColor:'darkturquoise',
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
        <View 
            style={{
              width:width,
              height:height * 1,
              backgroundColor:'darkturquoise',
              justifyContent: 'flex-start',
              alignItems: 'center',
              }}
            > 
              <Text style={styles.text}>{this.state.board}</Text>
          <TouchableOpacity
            onPress={ async () => {
              const value1 = await AsyncStorage.getItem('@User1');
              console.log(value1);
              fetch(`http://${Config.SERVER_IP}:${Config.PORT}/check_login`)
              //this.props.navigation.navigate('TabOneDrawerTwo')
              try {
                const value = await AsyncStorage.getItem('@User');
                if (value !== null){
                  // We have data!!
                  console.log(value);
                }
              } catch (error) {
                console.log(error);
              }
              //console.log(this.props.navigation.state.params.data);
            }}>
            <Text>{'Go to next screen this tab'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={ () => {
              FCM.getFCMToken().then(token => {
                console.log(token);
                alert(token);
              });
            }}>
            <Text>{'dispatch Action Go to next screen this tab'}</Text>
          </TouchableOpacity>
        </View>
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
    flex: 1,
    marginTop: Platform.OS == 'ios' ? 25 : 0,
    height: height,
    width: width,
  },
});