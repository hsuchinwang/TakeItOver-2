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
  AsyncStorage
} from 'react-native';
import * as Config from '../../constants/config';
import LoginForm from '../../components/LoginForm';

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
        await AsyncStorage.setItem('@User', JSON.stringify(response.user));
      } catch (error) {
        console.log(error);
        // Error saving data
      }
      this.props.navigation.navigate('Home');
    } else {
      alert('密碼錯誤');
    }
  } catch(error) {
    console.log(error);
  }
}


export default class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username:'',
      password:''
    }
  }
  submit(value) {
    login.bind(this, value)();
  }
  render() {
    return(
      <View style={[styles.container]}>
        <LoginForm Submit={this.submit.bind(this)} />
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});