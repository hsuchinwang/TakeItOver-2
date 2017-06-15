'use strict'
import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Platform } from 'react-native';
import BackgroundImage from '../../components/BackgroundImage';
export default class TabOneScreenFour extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      visible: false,
      title:'國家歷史',
      headerTitleStyle:{
        alignSelf: 'center',
        marginLeft: -20,
      },
      headerLeft: (
        <Ionicons.Button name="ios-menu" color="#185ffe" style={{marginLeft:13}}backgroundColor="#eeeef2" onPress={() => navigation.navigate('DrawerOpen')}>
        </Ionicons.Button>
      ),
      drawerLabel: '國家歷史',
      drawerIcon: ({ tintColor }) => (
        <Ionicons
          name={'md-cloudy-night'}
          size={Platform == 'ios' ? 26 : 20}
          style={{ color: tintColor }}
        />
      ),
    }
  };

  render(){
    return(
      <BackgroundImage url="Fire">
        <View style={styles.main}>
          <View style={styles.box}>
            <Text style={styles.text}>{ '國家歷史' }</Text>
          </View>
        </View>
      </BackgroundImage>
    )
  }
}
const styles = StyleSheet.create({
    text: {
        textAlign: 'center',
        color: 'black',
        backgroundColor: 'rgba(0,0,0,0)',
        fontSize: 32
    },
    box: {
      height: 200,
      width: 200,
      backgroundColor: "#ffffff",
      borderRadius: 10,
      shadowColor: "#000000",
      shadowOpacity: 0.8,
      shadowRadius: 2,
      shadowOffset: {
        height: 10,
        width: 0
      }
    }
});