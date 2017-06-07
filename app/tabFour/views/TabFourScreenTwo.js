'use strict'
import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, RefreshControl, ScrollView, Platform } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class TabFourScreenTwo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isRefreshing: false,
    };
  }
  _onRefresh() {
    this.setState({isRefreshing: true});
    setTimeout(() => {
      this.setState({isRefreshing: false});
    },500);
  }
  render() {
    return(
        <ScrollView
          style={styles.contentContainer}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={this._onRefresh.bind(this)}
              title="Loading..."
            />
          }
        >
          <View style={styles.diamondContainer}>
            <Text style={styles.diamondText}>
              寶石：10000
              </Text>
          </View>
          <View style={styles.resourceContainer1}>
            <Text style={styles.resourceText}>
              金：10000
              </Text>
              <Text style={styles.resourceText}>
              木：10000
              </Text>
              <Text style={styles.resourceText}>
              水：10000
              </Text>
          </View>
          <View style={styles.resourceContainer2}>
            <Text style={styles.resourceText}>
              火：10000
              </Text>
              <Text style={styles.resourceText}>
              土：10000
              </Text>
          </View>
        </ScrollView>
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
    //paddingVertical: 1,
    marginTop: Platform.OS == 'ios' ? 25 : 0,
  },
  diamondContainer: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#EDE7C9',
    marginTop: 3,
    marginBottom: 3,
    marginLeft: 3,
    marginRight: 3,
    borderWidth: 5,
    borderColor: '#F9CF7A',
  },
  diamondText: {
    textAlign: 'center',
    fontWeight: 'bold',
    width: '100%',
    backgroundColor: '#D25141',
    color: '#F9CF7A',
    fontSize: 16,
    lineHeight: 32,
    padding: 0,
    borderRadius: 10,
  },
  resourceContainer1: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'center',
    marginLeft: 3,
    marginRight: 3,
    borderRadius: 10,
    paddingTop: 10,
    backgroundColor: '#D25141',
  },
  resourceContainer2: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'center',
    marginLeft: 3,
    marginRight: 3,
    borderRadius: 10,
    paddingBottom: 10,
    backgroundColor: '#D25141',
  },
  resourceText: {
    textAlign: 'center',
    fontWeight: 'bold',
    flexShrink: 1,
    width: '100%',
    backgroundColor: '#D25141',
    color: '#F9CF7A',
    fontSize: 16,
    lineHeight: 32,
    padding: 0,
  },
});