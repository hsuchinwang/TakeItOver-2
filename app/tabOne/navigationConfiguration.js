'use strict'

import React from 'react';
import { View, Text, Image, StyleSheet, Platform } from 'react-native';
import { StackNavigator, DrawerNavigator, DrawerItems } from 'react-navigation';
// Screens
import TabOneScreenOne from './views/TabOneScreenOne';
import TabOneScreenTwo from './views/TabOneScreenTwo';
import TabOneScreenThree from './views/TabOneScreenThree';
import TabOneScreenFour from './views/TabOneScreenFour';
//import BackgroundImage from '../components/BackgroundImage';

const SideDrawer = (props) => {
  return (
    <View style={styles.DrawerContainer}>
      <View style={styles.drawerIconContainer}>
        <Image  
          source={require('../images/galaxy.png')}
          style={styles.drawerIcon}
        />
      </View>
      <View style={{height:1, width:'100%', backgroundColor:'black'}}></View>
      <DrawerItems {...props} />
    </View>
  )
};


const styles = StyleSheet.create({
    DrawerContainer: {
      flex:1,
      marginTop: Platform == "ios" ? 25 : 0,
      backgroundColor: 'gray'
    },
    drawerHeader: {
      flex:1
    },
    drawerIconContainer:{
      height: 200,
      width: '100%',
      resizeMode: 'cover',
      alignItems:'center',
      justifyContent:'center',
    },
    drawerIcon: {
        width: 100,
        height: '50%',
        borderRadius:10,
    },
});
const stackNavigatorConfiguration = {
  headerMode: 'none',
}
const tabOneDrawerOne = StackNavigator({
  TabOneScreenOne: { screen: TabOneScreenOne },
  },
  stackNavigatorConfiguration
);

const tabOneDrawerTwo = StackNavigator({
  TabOneScreenTwo: { screen: TabOneScreenTwo },
  },
  stackNavigatorConfiguration
);

const tabOneDrawerThree = StackNavigator({
  TabOneScreenThree: { screen: TabOneScreenThree },
  },
  stackNavigatorConfiguration
);

const tabOneDrawerFour = StackNavigator({
  TabOneScreenFour: { screen: TabOneScreenFour },
  },
  stackNavigatorConfiguration
);

const routeConfiguration = {
  TabOneDrawerOne: { screen: tabOneDrawerOne },
  TabOneDrawerTwo: { screen: tabOneDrawerTwo },
  TabOneDrawerThree: { screen: tabOneDrawerThree },
  TabOneDrawerFour: { screen: tabOneDrawerFour },
}
// going to disable the header for now
const DrawerNavigatorConfiguration = {
  initialRouteName: 'TabOneDrawerOne',
  contentComponent: SideDrawer,
}
export const NavigatorTabOne = DrawerNavigator(routeConfiguration, DrawerNavigatorConfiguration);