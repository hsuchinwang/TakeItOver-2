'use strict'
import React from 'react';
import { View, Text, TouchableOpacity, Button } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
export default class TabThreeScreenTwo extends React.Component {
  static navigationOptions = ({ navigation }) => {
    
    const {state, setParams} = navigation;
    //const isInfo = state.params.mode === 'info';
    //const {user} = state.params;
    return {
      //title: isInfo ? `${user}'s Contact Info` : `Chat with ${state.params.user}`,
      title: '尋寶獵人2',
      headerRight: (
        <Icon.Button name="qrcode" color="#000" backgroundColor="#eeeef2" onPress={() => console.log(navigation)}>
        </Icon.Button>
      ),
      headerLeft: (
        <Ionicons
            name='ios-arrow-back'
            size={24}
            color='#1c79ff'
            style={{marginLeft:13}}
            onPress={()=>{navigation.goBack();}}
        >
        {state.params.titleName}
        </Ionicons>
      ),
    };
  };
  render(){
    return(
      <View style={{
        flex:1,
        backgroundColor:'blue',
        alignItems:'center',
        justifyContent:'center'
      }}>
        <Text>{ 'Tab Three Screen Two' }</Text>
        <TouchableOpacity
          onPress={ () => this.props.navigation.navigate('TabThreeScreenThree') }
          style={{
            padding:20,
            borderRadius:20,
            backgroundColor:'yellow',
            marginTop:20
          }}>
          <Text>{'Go to screen three'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={ () => this.props.navigation.goBack() }
          style={{
            padding:20,
            borderRadius:20,
            backgroundColor:'deeppink',
            marginTop:20
          }}>
          <Text>{'Go back a screen this tab'}</Text>
        </TouchableOpacity>

      </View>
    )
  }
}
