'use strict'
// React
import React from 'react';
import { AppRegistry, Platform, StyleSheet, View, TextInput, Button, TouchableOpacity, Text } from 'react-native';
// Redux
import { Provider } from 'react-redux';
import configureStore from './app/store/configureStore';
// Navigation
import TabBarNavigation from './app/tabBar/views/TabBarNavigation';
import io from 'socket.io-client';
import * as Config from './app/constants/config';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    justifyContent: 'center',
    alignItems: 'center',
  }
});
async function login(username, password) {
  try {
    let response = await fetch(
      'http://localhost:8083/login',
      {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
        body: JSON.stringify({
          'username': username,
          'password': password
        })
     }
    )
    .then((response) => response.json())
    .catch((error) => {
      console.error(error);
      return error;
    });
    return response;
  } catch(error) {
    console.log(error);
  }
}
async function check_login() {
  try {
    let response = await fetch(
      'http://localhost:8083/check_login',
      {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
     }
    )
    .then((response) => response.json())
    .catch((error) => {
      console.error(error);
      return error;
    });
    this.setState({
      loggedIn: response.loggedIn
    })
  } catch(error) {
    console.log(error);
  }
}
class App extends React.Component {
  static childContextTypes = {
    socket: React.PropTypes.object,
  }
  constructor(props) {
    super(props);
    this.socket = io(`${Config.BASECONNECTION}:${Config.PORT}`, { transports: ['websocket'] });
    this.state = {
      loggedIn: false,
      username:'',
      password:''
    }
  }
  getChildContext() {
    return {
      socket: this.socket,
    }
  }
  componentWillMount() {
    check_login.bind(this)();
  }
  async handlePress() {
    const result = await login(this.state.username, this.state.password);
    this.setState({
      loggedIn: result.loggedIn,
    });
  }
  render() {
    if (this.state.loggedIn) {
      return (
        <Provider store={configureStore()}>
          <TabBarNavigation />
        </Provider>
      );
    } else {
      return (
        <View style={[styles.container]}>
          <TextInput
            style={{height: 40, borderColor: 'gray', borderWidth: 1}}
            onChangeText={(username) => this.setState({username})}
            value={this.state.username}
          />
          <TextInput
            style={{height: 40, borderColor: 'gray', borderWidth: 1}}
            onChangeText={(password) => this.setState({password})}
            value={this.state.password}
          />
          <Button title={'登入'} onPress={this.handlePress.bind(this)}></Button>
        </View>
      )
    }
  }
}

AppRegistry.registerComponent('TakeItOver', () => App);
