import React from 'react';
//import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addNavigationHelpers, StackNavigator ,DrawerNavigator, TabNavigator } from 'react-navigation';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SimpleTabs from '../components/SimpleTabs';
import LoginScreen from '../components/LoginScreen';
import MainScreen from '../components/MainScreen';
import ProfileScreen from '../components/ProfileScreen';

export const AppNavigator = StackNavigator({
  Login: { screen: LoginScreen },
  Main: { screen: MainScreen },
  Profile: { screen: ProfileScreen },
});

const TabsInDrawer = DrawerNavigator({
  SimpleTabs: {
    screen: SimpleTabs,
    navigationOptions: {
      drawer: () => ({
        label: 'Simple Tabs',
        icon: ({ tintColor }) => (
          <MaterialIcons
            name="filter-1"
            size={24}
            style={{ color: tintColor }}
          />
        ),
      }),
    },
  },
});

const AppWithNavigationState = ({ dispatch, nav }) => (
  <AppNavigator navigation={addNavigationHelpers({ dispatch, state: nav })} />
);

// AppWithNavigationState.propTypes = {
//   dispatch: PropTypes.func.isRequired,
//   nav: PropTypes.object.isRequired,
// };

const mapStateToProps = state => ({
  nav: state.nav,
});
export default AppNavigator;
//export default connect(mapStateToProps)(AppWithNavigationState);
