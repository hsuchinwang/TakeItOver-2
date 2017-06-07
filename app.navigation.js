'use strict'
// React
import React from 'react';
import { AppRegistry, Platform, StyleSheet, View, TextInput, Button, TouchableOpacity, Text, Animated } from 'react-native';
// Redux
import { Provider } from 'react-redux';
import configureStore from './app/store/configureStore';
// Navigation
import TabBarNavigation from './app/tabBar/views/TabBarNavigation';
import io from 'socket.io-client';
import * as Config from './app/constants/config';

class App extends React.Component {
  static childContextTypes = {
    socket: React.PropTypes.object,
  }
  constructor(props) {
    super(props);
    this.socket = io(`${Config.BASECONNECTION}:${Config.PORT}`, { transports: ['websocket'] });
  }
  getChildContext() {
    return {
      socket: this.socket,
    }
  }
  render() {
    return(
      <Provider store={configureStore()}>
        <TabBarNavigation />
      </Provider>
    )
  }
}

AppRegistry.registerComponent('TakeItOver', () => App);
