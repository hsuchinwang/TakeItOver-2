'use strict'
import React from 'react';
import { View, Text, TouchableOpacity, WebView, StyleSheet, Platform } from 'react-native';

var styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Platform.OS == 'ios' ? 25 : 0,
  }
});
export default class TabThreeScreenThree extends React.Component {
  render() {
    return(
      <View style={styles.container}>
        <WebView
          ref={'webview'}
          automaticallyAdjustContentInsets={false}
          //style={styles.webView}
          source={{uri: 'https://billyoungdi.typeform.com/to/cHd1k0'}}
          javaScriptEnabled={true}
          //onNavigationStateChange={this.onNavigationStateChange.bind(this)}
          //startInLoadingState={true}
          scalesPageToFit={true}
        />
      </View>
    )
  }
}
