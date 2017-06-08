'use strict'
import React from 'react';
import { 
  StyleSheet,
  Platform,
  AsyncStorage
} from 'react-native';
import InitialScreen from '../../components/initialScreen';
import BackgroundImage from '../../components/BackgroundImage';
import Spinner from 'react-native-spinkit';
import { NavigationActions } from 'react-navigation'
import * as Config from '../../constants/config';

async function check_login() {
  
  const isLogined = await AsyncStorage.getItem('@isLogined');
  if (isLogined == "Y") {
    this.props.navigation.navigate('Home');
  } else {
    this.props.navigation.navigate('Login');
  }
  // try {
  //   let response = await fetch(
  //     `http://${Config.SERVER_IP}:${Config.PORT}/check_login`,
  //     {
  //     method: 'GET',
  //     headers: {
  //       'Accept': 'application/json',
  //       'Content-Type': 'application/json',
  //     }
  //    }
  //   )
  //   .then((response) => response.json())
  //   .catch((error) => {
  //     console.error(error);
  //     return error;
  //   });
  //   if (response.loggedIn) {
  //     await AsyncStorage.setItem('@User', JSON.stringify(response.user));
  //     this.props.navigation.navigate('Home');
  //   } else {
  //     this.props.navigation.navigate('Login');
  //   }
  // } catch(error) {
  //   console.log(error);
  // }
}
export default class SplashScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      isVisible: true,
      type: 'WanderingCubes',
    };
  }

  componentDidMount() {
    setTimeout(()=>{
      this.setState({
        isVisible: false
      });
      check_login.bind(this)();
    }, 3000);
  }
  render() {
    return(
      <BackgroundImage url={"Galaxy"}>
        <Spinner style={styles.spinner} isVisible={this.state.isVisible} size={100} type={this.state.type} color={'#FFFFFF'}/>
      </BackgroundImage>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinner: {
    marginBottom: 50
  },
});