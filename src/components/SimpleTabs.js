import React from 'react';
import { Button, Platform, ScrollView, StyleSheet, TabBarIOS } from 'react-native';
import { TabNavigator } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome';

const MyNavScreen = ({ navigation, banner }) => (
  <ScrollView style={styles.container}>
    <Button
      onPress={() => navigation.navigate('Home')}
      title="Go to home tab"
    />
    <Button
      onPress={() => navigation.navigate('Settings')}
      title="Go to settings tab"
    />
    <Button
      onPress={() => navigation.navigate('DrawerOpen')}
      title="open drawer"
    />
    <Button onPress={() => navigation.goBack(null)} title="Go back" />
   
  </ScrollView>
);

const MyHomeScreen = ({ navigation }) => (
  <MyNavScreen banner="Home Tab" navigation={navigation} />
);

MyHomeScreen.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarIcon: ({ tintColor, focused }) => (
    <Ionicons
      name={focused ? 'ios-home' : 'ios-home-outline'}
      size={Platform == 'ios' ? 26 : 20}
      style={{ color: tintColor }}
    />
  )
};

const MyPeopleScreen = ({ navigation }) => (
  <MyNavScreen banner="People Tab" navigation={navigation} />
);

MyPeopleScreen.navigationOptions = {
  tabBarLabel: 'People',
  tabBarIcon: ({ tintColor, focused }) => (
    <Ionicons
      name={focused ? 'ios-people' : 'ios-people-outline'}
      size={Platform == 'ios' ? 26 : 20}
      style={{ color: tintColor }}
    />
  ),
};

const MyChatScreen = ({ navigation }) => (
  <MyNavScreen banner="Chat Tab" navigation={navigation} />
);

MyChatScreen.navigationOptions = {
  tabBarLabel: 'Chat',
  tabBarIcon: ({ tintColor, focused }) => (
    <Ionicons
      name={focused ? 'ios-chatboxes' : 'ios-chatboxes-outline'}
      size={Platform == 'ios' ? 26 : 20}
      style={{ color: tintColor }}
    />
  ),
};

const MySettingsScreen = ({ navigation }) => (
  <MyNavScreen banner="Settings Tab" navigation={navigation} />
);

MySettingsScreen.navigationOptions = {
  tabBarLabel: 'Settings',
  tabBarIcon: ({ tintColor, focused }) => (
    <Ionicons
      name={focused ? 'ios-settings' : 'ios-settings-outline'}
      size={Platform == 'ios' ? 26 : 20}
      style={{ color: tintColor }}
    />
  ),
};

const SimpleTabs = TabNavigator(
  {
    Home: {
      screen: MyHomeScreen,
      path: '',
    },
    People: {
      screen: MyPeopleScreen,
      path: 'cart',
    },
    Chat: {
      screen: MyChatScreen,
      path: 'chat',
    },
    Settings: {
      screen: MySettingsScreen,
      path: 'settings',
    },
  },
  {
    tabBarOptions: {
      activeTintColor: Platform.OS === 'ios' ? '#fff' : '#fff',
      labelStyle: {
          fontSize: Platform.OS === 'ios' ? 12 : 10,
      },
      showIcon: true,
      style: {
        backgroundColor: '#339e85',
      },
      indicatorStyle: {
        backgroundColor: '#fff',
      }
    },
  }
);

const styles = StyleSheet.create({
  container: {
    marginTop: Platform.OS === 'ios' ? 20 : 0,
  },
});

export default SimpleTabs;