'use strict'

import React from 'react';
import { View, Text, Image, StyleSheet, Platform, ScrollView } from 'react-native';
import { StackNavigator, DrawerNavigator, DrawerItems, NavigationActions } from 'react-navigation';
// Screens
import TabOneScreenOne from './views/TabOneScreenOne';
import TabOneScreenTwo from './views/TabOneScreenTwo';
import TabOneScreenThree from './views/TabOneScreenThree';
import TabOneScreenFour from './views/TabOneScreenFour';
import TabOneScreenFive from './views/TabOneScreenFive';
import TabOneScreenSix from './views/TabOneScreenSix';
import * as Config from '../constants/config';

const SideDrawer = (props) => {
  return (
    <ScrollView>
    <View style={styles.DrawerContainer}>
      <View style={styles.drawerIconContainer}>
        <Image  
          source={require('../images/galaxy.png')}
          style={styles.drawerIcon}
        />
      </View>
      <View style={{height:1, width:'100%', backgroundColor:'black'}}></View>
      <DrawerItems {...props} 
        onItemPress={(route) => {
          if (route.route.routeName === 'TabOneDrawerSix') {
            fetch(`http://${Config.SERVER_IP}:${Config.PORT}/logout`);
            props.navigation.navigate('DrawerClose');
            props.navigation.navigate('Login');
          } else {
            props.navigation.navigate('DrawerClose');
            props.navigation.navigate(route.route.routeName);
          }
        }}/>
    </View>
    </ScrollView>
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
const tabOneDrawerFive = StackNavigator({
  TabOneScreenFour: { screen: TabOneScreenFive },
  },
  stackNavigatorConfiguration
);
const tabOneDrawerSix = StackNavigator({
  TabOneDrawerSix: { screen: TabOneScreenSix },
  },
  stackNavigatorConfiguration
);

const routeConfiguration = {
  TabOneDrawerOne: { screen: tabOneDrawerOne },
  TabOneDrawerTwo: { screen: tabOneDrawerTwo },
  TabOneDrawerThree: { screen: tabOneDrawerThree },
  TabOneDrawerFour: { screen: tabOneDrawerFour },
  TabOneDrawerFive: { screen: tabOneDrawerFive },
  TabOneDrawerSix: { screen: tabOneDrawerSix },
}
// going to disable the header for now
const DrawerNavigatorConfiguration = {
  initialRouteName: 'TabOneDrawerOne',
  contentComponent: SideDrawer,
}
export const NavigatorTabOne = DrawerNavigator(routeConfiguration, DrawerNavigatorConfiguration);