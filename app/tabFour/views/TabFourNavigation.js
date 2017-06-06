'use strict'

// React
import React from 'react';
import { Platform } from 'react-native';
// Navigation
import { addNavigationHelpers } from 'react-navigation';
import { NavigatorTabFour } from '../navigationConfiguration';
import { goSecond } from '../../actions/tabOneAction';
// Redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// Icon
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';

const mapStateToProps = (state) => {
  return {
    navigationState: state.tabFour
  }
}
function mapDispatchToProps(dispatch) {
  return {
    actions: {
      goSecond: bindActionCreators(goSecond, dispatch),
    },
    dispatch,
  };
}
class TabFourNavigation extends React.Component {
  static navigationOptions = {
    tabBarLabel: '領土爭奪',
    tabBarIcon: ({ tintColor, focused }) => (
      <Ionicons
        name={focused ? 'ios-flag' : 'ios-flag-outline'}
        size={Platform.OS == 'ios' ? 30 : 30}
        style={{ color: '#eff0f4' }}
      />
    )
  }

  render(){
    const { navigationState, dispatch, actions } = this.props
    return (
      <NavigatorTabFour
        navigation={
          addNavigationHelpers({
            dispatch: dispatch,
            actions: actions,
            state: navigationState
          })
        }
      />
    )
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(TabFourNavigation)
