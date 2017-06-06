'use strict'
// React
import React from 'react';
import { Platform } from 'react-native';
// Navigation
import { addNavigationHelpers } from 'react-navigation';
import { NavigatorTabThree } from '../navigationConfiguration';
//Redux
import { connect } from 'react-redux';
// Icon
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';

const mapStateToProps = (state) => {
  return {
    navigationState: state.tabThree
  }
}
class TabThreeNavigation extends React.Component {
  static navigationOptions = {
    tabBarLabel: '尋寶',
    tabBarIcon: ({ tintColor, focused }) => (
      <Ionicons
        name={focused ? 'ios-eye' : 'ios-eye-outline'}
        size={Platform.OS == 'ios' ? 30 : 30}
        style={{ color: '#eff0f4' }}
      />
    )
  }

  render() {
    const { dispatch, navigationState} = this.props
    console.log(this.props);
    return (
        <NavigatorTabThree
          navigation={addNavigationHelpers({
            dispatch: dispatch,
            state: navigationState
          })}
        />
      )
  }
}

export default connect(mapStateToProps)(TabThreeNavigation)
