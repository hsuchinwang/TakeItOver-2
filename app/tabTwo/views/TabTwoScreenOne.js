'use strict'
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, RefreshControl, Button, Platform, AsyncStorage, Dimensions, TextInput } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { goSecond } from '../../actions/tabTwoAction';
import Puzzle from '../../components/Puzzle';
import Modal from 'react-native-modalbox';
import * as puzzle from '../../constants/puzzle';
import * as Config from '../../constants/config';
import { getMyUser, api_buyHint } from '../../api/api';
import ScorePuzzle from '../../components/ScorePuzzle';
const { width, height } = Dimensions.get("window");

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
      character: "",
      hint: "",
      isOpen: false,
      isDisabled: false,
      cost: "0",
      puzzle:"",
      password:"",
      K:0,
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
      isRefreshing: false,
      cost: user.country == 'M' ? "25" : "30",
    });
  }
  _onRefresh() {
    this.setState({isRefreshing: true});
    this.init();
  }

  puzzle_click(P_result, P) {
    this.setState({
      puzzle: P,
    })
    if (P_result == 'W') {
      this.setState({
        character: puzzle[P].character,
        hint: puzzle[P].hint
      })
      this.refs.W_modal.open();
    }
    if (P_result == "L") {
      this.refs.L_modal.open();
    }
    if (P_result == "N") {
      this.refs.N_modal.open();
    }
  }

  getHint() {
    alert('提示');
    this.setState({isOpen: false});
  }
  giveScore() {
    alert('給分數');
    this.setState({isOpen: false});
  }
  onChange(e) {
    console.log(e);
    // this.setState({

    // })
  }
  async buyHint() {
    const flag = await api_buyHint(this.state.cost, this.state.puzzle, 'W');
    if (flag.data) {
      alert('購買成功');
      this.init();
    } else {
      alert('K寶不足');
    }
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
              <Puzzle P_result={this.state.P1} onClick={this.puzzle_click.bind(this, this.state.P1, 'P1')} />
              <Puzzle P_result={this.state.P2} onClick={this.puzzle_click.bind(this, this.state.P2, 'P2')} />
              <Puzzle P_result={this.state.P3} onClick={this.puzzle_click.bind(this, this.state.P3, 'P3')} />
            </View>
            <View title="1" style={styles.row1}>
              <Puzzle P_result={this.state.P4} onClick={this.puzzle_click.bind(this, this.state.P4, 'P4')} />
              <Puzzle P_result={this.state.P5} onClick={this.puzzle_click.bind(this, this.state.P5, 'P5')} />
              <Puzzle P_result={this.state.P6} onClick={this.puzzle_click.bind(this, this.state.P6, 'P6')} />
            </View>
            <View title="1" style={styles.row1}>
              <Puzzle P_result={this.state.P7} onClick={this.puzzle_click.bind(this, this.state.P7, 'P7')} />
              <Puzzle P_result={this.state.P8} onClick={this.puzzle_click.bind(this, this.state.P8, 'P8')} />
              <Puzzle P_result={this.state.P9} onClick={this.puzzle_click.bind(this, this.state.P9, 'P9')} />
            </View>
            <Puzzle P_result={this.state.P10} onClick={this.puzzle_click.bind(this, this.state.P10, 'P10')} />
          </View>
        </ScrollView>
        <Modal
          style={[styles.modal]}
          position={"center"}
          ref={"W_modal"}
          isOpen={this.state.isOpen}
        >
          <Text style={styles.text}>{this.state.character}</Text>
          <Text style={styles.text}>{this.state.hint}</Text>
          <Button
            title={`Cancel`}
            onPress={() => this.setState({isOpen: false})}
            style={styles.btn}>
         </Button>
        </Modal>
        <Modal
          style={[styles.modal]}
          position={"center"}
          ref={"L_modal"}
          isOpen={this.state.isOpen}
        >
           <Text style={styles.text}>Lose, 是否花{this.state.cost}個K寶石購買提示</Text>
           <Button
             title={`OK`}
             onPress={this.buyHint.bind(this)}
             style={styles.btn}>
          </Button>
          <Button
            title={`Cancel`}
            onPress={() => this.setState({isOpen: false})}
            style={styles.btn}>
         </Button>
        </Modal>
        <Modal
          style={[styles.modal]}
          position={"center"}
          ref={"N_modal"}
          isOpen={this.state.isOpen}
        >
           <Text style={styles.text}>空的，關主輸入視窗</Text>
           <View sytle={{width:200, height:200}}>
           <ScorePuzzle Submit={this.giveScore.bind(this)}/>
           </View>
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
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
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
    alignItems: 'center',
    width:300,
    height:300,
    borderWidth: 3,
    borderColor:'rgba(252,252,252,0.5)',
    borderRadius: 10,
    shadowColor: "#000000",
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      height: 3,
      width: 0
    }
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
    fontSize: 14
  }
});
