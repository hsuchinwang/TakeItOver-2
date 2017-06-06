'use strict'
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BackgroundImage from '../../components/BackgroundImage';
import { Platform, Imagem, StyleSheet } from 'react-native';
export default class TabOneScreenTwo extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title:'工作坊',
      headerTitleStyle:{
        alignSelf: 'center',
        marginLeft: -20,
      },
      headerLeft: (
        <Ionicons.Button name="ios-menu" color="#185ffe" style={{marginLeft:13}}backgroundColor="#eeeef2" onPress={() => navigation.navigate('DrawerOpen')}>
        </Ionicons.Button>
      ),
      drawerLabel: '工作坊',
      drawerIcon: ({ tintColor }) => (
        <Ionicons
          name={'md-construct'}
          size={Platform == 'ios' ? 26 : 20}
          style={{ color: tintColor }}
        />
      ),
    }
  };
  render(){
    return(
      <BackgroundImage url={"Galaxy"} >
        <Text style={styles.text}>{ 'Tab One Screen Two' }</Text>
        <TouchableOpacity
          onPress={ () => this.props.navigation.navigate('DrawerOpen') }
          style={{
            padding:20,
            borderRadius:20,
            backgroundColor:'purple',
            marginTop:20
          }}>
          <Text>{'OpenDrawer'}</Text>
        </TouchableOpacity>
      </BackgroundImage>
    )
  }
}
const styles = StyleSheet.create({
    text: {
        textAlign: 'center',
        color: 'white',
        backgroundColor: 'rgba(0,0,0,0)',
        fontSize: 32
    }
});