'use strict'
// React
import React from 'react';
import { Platform } from 'react-native';
// Navigation
import { addNavigationHelpers } from 'react-navigation';
import { NavigatorTabTwo } from '../navigationConfiguration';
//Redux
import { connect } from 'react-redux';
// Icon
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';

const mapStateToProps = (state) => {
 return {
  navigationState: state.tabTwo,
  }
}
class TabTwoNavigation extends React.Component {
  static navigationOptions = {
    tabBarLabel: '解謎',
    tabBarIcon: ({ tintColor, focused }) => (
      <Ionicons
        name={focused ? 'ios-key' : 'ios-key-outline'}
        size={Platform.OS == 'ios' ? 30 : 30}
        style={{ color: '#eff0f4' }}
      />
    )
  }

render(){
    const { dispatch, navigationState} = this.props
return (
      <NavigatorTabTwo
        navigation={
          addNavigationHelpers({
            dispatch: dispatch,
            state: navigationState
          })
        }
      />
    )
  }
}

export default connect(mapStateToProps)(TabTwoNavigation)
