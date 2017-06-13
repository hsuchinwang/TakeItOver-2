'use strict'
// React
import React from 'react';
import { AppRegistry, Platform, StyleSheet, View, TextInput, Button, TouchableOpacity, Text, Animated } from 'react-native';
import CodePush from "react-native-code-push";
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
    this.socket = io(`${Config.SERVER_IP}:${Config.PORT}`, { transports: ['websocket'] });
  }
  getChildContext() {
    return {
      socket: this.socket,
    }
  }
  componentDidMount() {
      CodePush.sync({ updateDialog: false, installMode: CodePush.InstallMode.IMMEDIATE },
        (status) => {
          switch (status) {
            case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
              this.setState({showDownloadingModal: true});
              break;
            case CodePush.SyncStatus.INSTALLING_UPDATE:
              this.setState({showInstalling: true});
              break;
            case CodePush.SyncStatus.UPDATE_INSTALLED:
              this.setState({showDownloadingModal: false});
              break;
          }
        },
        ({ receivedBytes, totalBytes, }) => {
            this.setState({downloadProgress: receivedBytes / totalBytes * 100});
        }
      );
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
