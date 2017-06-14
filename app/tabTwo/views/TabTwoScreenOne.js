'use strict'
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, RefreshControl, Button, Platform } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { goSecond } from '../../actions/tabTwoAction';
//import { Item, Input, Icon } from 'native-base';
import Puzzle from '../../components/Puzzle';
import Modal from 'react-native-modalbox';
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
    this.state = {
      isRefreshing: false,
      board: '歡迎進入奇妙的世界！',
      titleText: "Bird's Nest",
      bodyText: 'This is not really a bird nest.',
      isOpen: false,
      isDisabled: false,
      swipeToClose: true,
      sliderValue: 0.3
    };
  }

  _onRefresh() {
    this.setState({isRefreshing: true});
    setTimeout(() => {
      this.setState({isRefreshing: false});
    },500);
  }

  puzzle_click(value) {
    this.refs.modal3.open();
  }

  addDiamonSuccess() {
    alert('新增寶石成功！');
    this.setState({isOpen: false});
  }

  render(){
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
        <View style={styles.row1Item} />
          <View style={styles.row1}>
            <Puzzle onClick={this.puzzle_click.bind(this, '555')} />
            <View title="1" style={styles.row1Item} />
            <View title="1" style={styles.row1Item} />
            <View title="1" style={styles.row1Item} />
            <View title="1" style={styles.row1Item} />
            <View title="1" style={styles.row1Item} />
            <View title="1" style={styles.row1Item} />
          </View>
          <View title="1" style={styles.row1}>
            <View title="1" style={styles.row1Item} />
            <View title="1" style={styles.row1Item} />
            <View title="1" style={styles.row1Item} />
            <View title="1" style={styles.row1Item} />
            <View title="1" style={styles.row1Item} />
            <View title="1" style={styles.row1Item} />
            <View title="1" style={styles.row1Item} />
          </View>
          <View title="1" style={styles.row1}>
            <View title="1" style={styles.row1Item} />
            <View title="1" style={styles.row1Item} />
            <View title="1" style={styles.row1Item} />
            <View title="1" style={styles.row1Item} />
            <View title="1" style={styles.row1Item} />
            <View title="1" style={styles.row1Item} />
            <View title="1" style={styles.row1Item} />
          </View>
          <View title="1" style={styles.row1}>
            <View title="1" style={styles.row1Item} />
            <View title="1" style={styles.row1Item} />
            <View title="1" style={styles.row1Item} />
            <View title="1" style={styles.row1Item} />
            <View title="1" style={styles.row1Item} />
            <View title="1" style={styles.row1Item} />
            <View title="1" style={styles.row1Item} />
          </View>
          <View title="1" style={styles.row1}>
            <View title="1" style={styles.row1Item} />
            <View title="1" style={styles.row1Item} />
            <View title="1" style={styles.row1Item} />
            <View title="1" style={styles.row1Item} />
            <View title="1" style={styles.row1Item} />
            <View title="1" style={styles.row1Item} />
            <View title="1" style={styles.row1Item} />
          </View>
          <View title="1" style={styles.row1}>
            <View title="1" style={styles.row1Item} />
            <View title="1" style={styles.row1Item} />
            <View title="1" style={styles.row1Item} />
            <View title="1" style={styles.row1Item} />
            <View title="1" style={styles.row1Item} />
            <View title="1" style={styles.row1Item} />
            <View title="1" style={styles.row1Item} />
          </View>
          <View title="1" style={styles.row1}>
            <View title="1" style={styles.row1Item} />
            <View title="1" style={styles.row1Item} />
            <View title="1" style={styles.row1Item} />
            <View title="1" style={styles.row1Item} />
            <View title="1" style={styles.row1Item} />
            <View title="1" style={styles.row1Item} />
            <View title="1" style={styles.row1Item} />
          </View>
          <View style={styles.diamondContainer}>
            <Text style={styles.diamondText}>
              寶石：10000
            </Text>
          </View>
          <TouchableOpacity
            onPress={ () => this.props.navigation.dispatch({ type:'AAA', payload:{ index:0 } }) }
            style={{
              padding:20,
              borderRadius:20,
              backgroundColor:'blue',
              marginTop:20
            }}>
            <Text>{'Go to next screen this tab'}</Text>
          </TouchableOpacity>
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

// <View>
// <Button title={"123"}>
// OnPress={() => alert("123")}
// </Button>
// </View>

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
  topBlankSpace: {

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
