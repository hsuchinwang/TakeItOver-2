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
  Alert
} from 'react-native';
import * as Config from '../../constants/config';
import LoginForm from '../../components/LoginForm';
import Spinner from 'react-native-loading-spinner-overlay';

async function login(value) {
  try {
    let response = await fetch(
      `http://${Config.SERVER_IP}:${Config.PORT}/login`,
      {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
        body: JSON.stringify({
          'username': value.username,
          'password': value.password
        })
     }
    )
    .then((response) => response.json())
    .catch((error) => {
      console.error(error);
      return error;
    });
    if (response.loggedIn) {
      try {
        await AsyncStorage.setItem('@isLogined', 'Y');
        await AsyncStorage.setItem('@UserData', JSON.stringify(response.user));
      } catch (error) {
        console.log(error);
        // Error saving data
      }
      this.setState({
        visible: !this.state.visible,
        wrong: false,
      });
      this.props.navigation.navigate('Home');
    } else {
      // Alert.alert('密碼或帳號錯誤');
      this.setState({
        visible: !this.state.visible,
        wrong: true,
      });
    }
  } catch(error) {
    this.setState({
      visible: !this.state.visible
    });
    console.log(error);
  }
}


export default class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      wrong: false,
    }
  }
  submit(value) {
    this.setState({
      visible: !this.state.visible
    });
    login.bind(this, value)();
  }
  render() {
    return(
      <View style={[styles.container]}>
        <LoginForm Submit={this.submit.bind(this)} wrong={this.state.wrong}/>
        <Spinner visible={this.state.visible} textContent={"Loading..."} textStyle={{color: '#FFF'}} />
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});