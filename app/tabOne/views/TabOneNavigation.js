'use strict'

// React
import React from 'react';

// Navigation
import { addNavigationHelpers } from 'react-navigation';
import { NavigatorTabOne } from '../navigationConfiguration';
import { goSecond } from '../../actions/tabOneAction';
import { Platform } from 'react-native';
// Redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// Icon
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';

const mapStateToProps = (state) => {
  return {
    navigationState: state.tabOne,
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
class TabOneNavigation extends React.Component {
  static navigationOptions = {
    tabBarLabel: '首頁',
    tabBarIcon: ({ tintColor, focused }) => (
      <Ionicons
        name={focused ? 'ios-home' : 'ios-home-outline'}
        size={Platform.OS == 'ios' ? 30 : 30}
        style={{ color: '#eff0f4' }}
      />
    )
  }

  render(){
    const { navigationState, dispatch, actions } = this.props
    return (
      <NavigatorTabOne
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
export default connect(mapStateToProps, mapDispatchToProps)(TabOneNavigation)
