'use strict'
import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Linking, 
  RefreshControl, 
  ScrollView, 
  Platform 
} from 'react-native';
import BackgroundImage from '../../components/BackgroundImage';
export default class TabFourScreenOne extends React.Component {
  static contextTypes = {
    socket: React.PropTypes.object,
  }
  static navigationOptions = {
    title: '領土爭奪戰',
    headerTitleStyle:{
      alignSelf: 'center',
    },
  }
  constructor(props) {
    super(props);
    this.state = {
      isRefreshing: false,
      title: '領土爭奪戰'
    };
  }
  componentWillMount() {
    this.context.socket.on('message', (message) => {
      this.setState({
        title: message.A,
      });
    });
  }
  _onRefresh() {
    this.setState({isRefreshing: true});
    setTimeout(() => {
      this.setState({isRefreshing: false});
    }, 500);
  }
  render() {
    const { socket } = this.context;
    return(
        <BackgroundImage url="Fire">
          <ScrollView
            contentContainerStyle={styles.contentContainer}
            refreshControl={
              <RefreshControl
                refreshing={this.state.isRefreshing}
                onRefresh={this._onRefresh.bind(this)}
                //tintColor="#ff0000"
                title="Loading..."
                //titleColor="#00ff00"
                //colors={['#ff0000', '#00ff00', '#0000ff']}
                //progressBackgroundColor="#ffff00"
              />
            }
          >
            <Text style={styles.text}>{this.state.title}</Text>
            <TouchableOpacity
              onPress={ () => this.props.navigation.navigate('TabFourScreenTwo') }
              style={{
                padding:20,
                borderRadius:20,
                backgroundColor:'pink',
                marginTop:20
              }}>
              <Text>{'Go to next screen this tab'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={ () => socket.emit('message',{A: '123'}) }
              style={{
                padding:20,
                borderRadius:20,
                backgroundColor:'white',
                marginTop:20
              }}>
              <Text>{'send emit to websocket server'}</Text>
            </TouchableOpacity>
          </ScrollView>
        </BackgroundImage>
    )
  }
}
const styles = StyleSheet.create({
  text: {
    textAlign: 'center',
    color: 'white',
    backgroundColor: 'rgba(0,0,0,0)',
    fontSize: 32
  },
  contentContainer:{
    marginTop: Platform.OS == 'ios' ? 25 : 0,
  },
});