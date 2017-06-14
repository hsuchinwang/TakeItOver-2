'use strict'
import { Platform } from 'react-native';
import { TabNavigator, StackNavigator } from 'react-navigation';
// Tab-Navigators
import TabOneNavigation from '../tabOne/views/TabOneNavigation';
import TabTwoNavigation from '../tabTwo/views/TabTwoNavigation';
import TabThreeNavigation from '../tabThree/views/TabThreeNavigation';
import TabFourNavigation from '../tabFour/views/TabFourNavigation';
import LoginScreen from './views/LoginScreen';
import SplashScreen from './views/SplashScreen';

const TabrouteConfiguration = {
  TabOneNavigation: { screen: TabOneNavigation },
  TabTwoNavigation: { screen: TabTwoNavigation },
  TabThreeNavigation: { screen: TabThreeNavigation },
  TabFourNavigation : { screen: TabFourNavigation },
}

const tabBarConfiguration = {
  ...TabNavigator.Presets.AndroidTopTabs,
  swipeEnabled: false,
  lazyLoad: true,
  tabBarPosition: 'bottom',
  tabBarOptions: {
    activeTintColor: Platform.OS === 'ios' ? '#fff' : '#fff',
    labelStyle: {
        fontSize: 12,
        color: '#eff0f4',
    },
    showIcon: true,
    showLabel: false,
    style: {
      backgroundColor: '#2c2f30',
      borderTopWidth: 3,
      borderTopColor: 'rgba(83,83,83,0.1)',
    },
    tabStyle: {
      borderRightWidth: 1,
      borderRightColor: 'white',
    },
    indicatorStyle: {
      backgroundColor: '#2c2f30',
    }
  }
}
const Home = TabNavigator(TabrouteConfiguration, tabBarConfiguration)

const StackrouteConfiguration = {
  Splash: { screen: SplashScreen },
  Home: { screen: Home },
  Login: { screen: LoginScreen },
}
const StackConfiguration = {
  initialRouteName:'Home',
  headerMode: 'none',
  navigationOptions:{
    gesturesEnabled: false,
  },
}
export const TabBar = StackNavigator(StackrouteConfiguration, StackConfiguration);

