'use strict'
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, RefreshControl, Button, Platform, AsyncStorage, Dimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { goSecond } from '../../actions/tabTwoAction';
//import { Item, Input, Icon } from 'native-base';
import Puzzle from '../../components/Puzzle';
import Modal from 'react-native-modalbox';
import * as puzzle from '../../constants/puzzle';
import * as Config from '../../constants/config';
const { width, height } = Dimensions.get("window");

async function getMyUser() {
  const username = await AsyncStorage.getItem('@UserName');
    let response = await fetch(
      `http://${Config.SERVER_IP}:${Config.PORT}/get_my_user`,
      {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
        body: JSON.stringify({
          'name': username,
        })
     }
    )
    .then((response) => response.json())
    .catch((error) => {
      console.error(error);
      return error;
    });
    return response[0];
}

export default class TabTwoScreenOne extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: '九宮格解謎',
      headerTitleStyle:{
        alignSelf: 'center',
      }
    };
  };

  constructor(props) {// like initial function
    super(props);
    this.init();
    this.state = {
      isRefreshing: false,
      P1: "",
      P2: "",
      P3: "",
      P4: "",
      P5: "",
      P6: "",
      P7: "",
      P8: "",
      P9: "",
      P10: "",
      isOpen: false,
      isDisabled: false,
    };
  }
  async init() {
    const user = await getMyUser();
    this.setState({
      P1: user.P1,
      P2: user.P2,
      P3: user.P3,
      P4: user.P4,
      P5: user.P5,
      P6: user.P6,
      P7: user.P7,
      P8: user.P8,
      P9: user.P9,
      P10: user.P10,
      isRefreshing: false
    });
  }
  _onRefresh() {
    this.setState({isRefreshing: true});
    this.init();
  }

  puzzle_click(value) {
    this.refs.modal3.open();
  }

  addDiamonSuccess() {
    alert('新增寶石成功！');
    this.setState({isOpen: false});
  }

  render() {
    console.log(this.state);
    return(
      <View>
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
          <View style={{flex:1, width:width, height:height, justifyContent:'center', alignItems:'center'}}>
            <View style={styles.row1}>
              <Puzzle P_result={this.state.P1} onClick={this.puzzle_click.bind(this, this.state.P1)} />
              <Puzzle P_result={this.state.P2} onClick={this.puzzle_click.bind(this, this.state.P2)} />
              <Puzzle P_result={this.state.P3} onClick={this.puzzle_click.bind(this, this.state.P3)} />
            </View>
            <View title="1" style={styles.row1}>
              <Puzzle P_result={this.state.P4} onClick={this.puzzle_click.bind(this, this.state.P4)} />
              <Puzzle P_result={this.state.P5} onClick={this.puzzle_click.bind(this, this.state.P5)} />
              <Puzzle P_result={this.state.P6} onClick={this.puzzle_click.bind(this, this.state.P6)} />
            </View>
            <View title="1" style={styles.row1}>
              <Puzzle P_result={this.state.P7} onClick={this.puzzle_click.bind(this, this.state.P7)} />
              <Puzzle P_result={this.state.P8} onClick={this.puzzle_click.bind(this, this.state.P8)} />
              <Puzzle P_result={this.state.P9} onClick={this.puzzle_click.bind(this, this.state.P9)} />
            </View>
            <Puzzle P_result={this.state.P10} onClick={this.puzzle_click.bind(this, this.state.P10)} />
          </View>
        </ScrollView>
        <Modal
          style={[styles.modal, styles.modal3]}
          position={"center"}
          ref={"modal3"}
          //isDisabled={this.state.isDisabled}
          isOpen={this.state.isOpen}
        >
           <Text style={styles.text}>Modal centered</Text>
           <Button
             title={`OK`}
             onPress={this.addDiamonSuccess.bind(this)}
             style={styles.btn}>
          </Button>
          <Button
            title={`Cancel`}
            onPress={() => this.setState({isOpen: false})}
            style={styles.btn}>
         </Button>
         </Modal>
      </View>

    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  contentContainer: {
    paddingVertical: 1,
    marginTop: Platform.OS == 'ios' ? 25 : 0,
  },
  row1: {
    width: '100%',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignContent: 'center',
    flexWrap: 'nowrap',
  },
  row1Item: {
    flexShrink:1,
    width: '100%',
    height: 50,
    margin: 0.5,
    backgroundColor: 'red',
  },
  baseText: {
   fontFamily: 'Cochin',
   width: 100,
   height: 100,
  },
  titleText: {
     fontSize: 20,
     fontWeight: 'bold',
  },
  diamondContainer: {
    flex: 1,
    // width: '100%',
    // justifyContent: 'flex-start',
    flexDirection: 'row',
    // alignContent: 'center',
    flexWrap: 'nowrap',
    alignItems: 'center',
    backgroundColor: '#EDE7C9',
    marginTop: 3,
    marginBottom: 3,
    marginLeft: 3,
    marginRight: 3,
    borderWidth: 5,
    borderColor: '#F9CF7A',
  },
  diamondText: {
    textAlign: 'center',
    fontWeight: 'bold',
    flexShrink:1,
    width: '100%',
    backgroundColor: '#D25141',
    color: '#F9CF7A',
    fontSize: 16,
    lineHeight: 32,
    borderRadius: 10,
    padding: 10,
  },
  resourceContainer1: {
    flex: 1,
    // width: '100%',
    // justifyContent: 'flex-start',
    flexDirection: 'row',
    // alignContent: 'center',
    flexWrap: 'nowrap',
    alignItems: 'center',
    marginLeft: 3,
    marginRight: 3,
    borderRadius: 10,
    paddingTop: 10,
    backgroundColor: '#D25141',
  },
  resourceContainer2: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'center',
    marginLeft: 3,
    marginRight: 3,
    borderRadius: 10,
    paddingBottom: 10,
    backgroundColor: '#D25141',
  },
  resourceText: {
    textAlign: 'center',
    fontWeight: 'bold',
    flexShrink:1,
    width: '100%',
    backgroundColor: '#D25141',
    color: '#F9CF7A',
    fontSize: 16,
    lineHeight: 32,
    padding: 0,
  },
  modal: {
  justifyContent: 'center',
  alignItems: 'center'
  },
  modal2: {
    height: 230,
    backgroundColor: "#3B5998"
  },

  modal3: {
    height: 300,
    width: 300
  },

  modal4: {
    height: 300
  },

  btn: {
    margin: 10,
    backgroundColor: "#3B5998",
    color: "white",
    padding: 10
  },

  btnModal: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 50,
    height: 50,
    backgroundColor: "transparent"
  },
  text: {
    color: "black",
    fontSize: 22
  }
});
