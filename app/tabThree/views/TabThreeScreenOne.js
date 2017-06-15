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
  Platform,
  Button,
  Image 
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { NavigationActions } from 'react-navigation';
import { reset } from '../../actions/tabThreeAction';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MapPuzzle from '../../components/MapPuzzle';
import Modal from 'react-native-modalbox';
import ScorePuzzle from '../../components/ScorePuzzle';
{/*<Icon.Button name="qrcode" color="#000" backgroundColor="#eeeef2" onPress={() => navigation.navigate('TabThreeScreenTwo', {titleName: titleName})}>
</Icon.Button>*/}

export default class TabThreeScreenOne extends React.Component {

  static navigationOptions = ({ navigation }) => {
    const titleName = '尋寶獵人';
    return {
      title: titleName,
      headerTitleStyle:{
        alignSelf: 'center',
        marginRight: -20,
      },
      headerRight: (
        <Icon.Button 
          name="qrcode" 
          color="#000"
          style={{alignItems:'center', justifyContent:'center' }}
          backgroundColor="#eeeef2" 
          onPress={() => 
            navigation.navigate('TabThreeScreenFour') //QR code Page
          }
        />
      ),
      headerLeft: null,
    };
  };
  constructor(props) {
    super(props);
    this.state = {
      isRefreshing: false,
      board: '歡迎進入奇妙的世界！'
    };
  }
  componentWillMount() {
    if (this.props.navigation.state.params) {
      alert(this.props.navigation.state.params.data);
    }
  }
  _onRefresh() {
    this.setState({isRefreshing: true});
    setTimeout(() => {
      this.setState({isRefreshing: false});
    },500);
  }

  puzzle_click(value) {
    this.refs.N_modal.open();
  }

  addDiamonSuccess() {
    alert('新增寶石成功！');
    this.setState({isOpen: false});
  }

  async giveScore(value) {
    const flag = await api_giveScore(value.K, value.password, value.puzzle_result, this.state.puzzle);
    if (flag.data) {
      alert('輸入成功');
      this.init();
    } else {
      alert('密碼錯誤別亂試～');
    }
    this.setState({isOpen: false});
  }

  render() {
    return(
      // <View style={{
      //   flex:1,
      //   backgroundColor:'aqua',
      //   alignItems:'center',
      //   justifyContent:'center'
      // }}>
      <View style={{
        justifyContent:'center',
        alignSelf: 'stretch', 
      }}>
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
          <Icon.Button 
            name="qrcode" 
            color="#000"
            style={{alignItems:'center', justifyContent:'center' }}
            backgroundColor="#eeeef2" 
            onPress={() => 
              this.props.navigation.navigate('TabThreeScreenFour') //QR code Page
            }
          >

          <Text>{'掃寶物'}</Text>
          </Icon.Button>
          <Text>{ 'Tab Three Screen One' }</Text>

          <TouchableOpacity
            onPress={ () => this.props.navigation.navigate('TabThreeScreenTwo',{titleName: '尋寶獵人'}) }
            style={{
              padding:20,
              borderRadius:20,
              backgroundColor:'yellow'
            }}>
            <Text>{'Go to next screen this tab'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={
              () => this.props.navigation.dispatch({ type:'JUMP_TO_TAB', payload:{ index:0 } })
            }
            style={{
              padding:20,
              borderRadius:20,
              backgroundColor:'deeppink',
              marginTop:20
            }}>
            <Text>{'jump to tab one'}</Text>
          </TouchableOpacity>
          <View style={styles.map}>
            <View style={styles.row1}>
              <MapPuzzle onClick={this.puzzle_click.bind(this, 'F')} />
              <View title="1" style={styles.row1Item} />
              <MapPuzzle onClick={() => this.props.navigation.navigate('TabThreeScreenFour')} />
              <View title="1" style={styles.row1Item} />
              <MapPuzzle onClick={this.puzzle_click.bind(this, 'A')} />
            </View>
            <View title="1" style={styles.row1}>
              <View title="1" style={styles.row1Item} />
              <MapPuzzle onClick={this.puzzle_click.bind(this, 'C')} />
              <MapPuzzle onClick={this.puzzle_click.bind(this, 'H')} />
              <View title="1" style={styles.row1Item} />
              <View title="1" style={styles.row1Item} />
            </View>
            <View title="1" style={styles.row1}>
              <MapPuzzle onClick={() => this.props.navigation.navigate('TabThreeScreenFour')} />
              <View title="1" style={styles.row1Item} />
              <View title="1" style={styles.row1Item} />
              <MapPuzzle onClick={this.puzzle_click.bind(this, 'B')} />
              <MapPuzzle onClick={() => this.props.navigation.navigate('TabThreeScreenFour')} />
            </View>
            <View title="1" style={styles.row1}>
              <View title="1" style={styles.row1Item} />
              <View title="1" style={styles.row1Item} />
              <MapPuzzle onClick={this.puzzle_click.bind(this, 'D')} />
              <View title="1" style={styles.row1Item} />
              <View title="1" style={styles.row1Item} />
            </View>
            <View title="1" style={styles.row1}>
              <MapPuzzle onClick={this.puzzle_click.bind(this, 'G')} />
              <View title="1" style={styles.row1Item} />
              <MapPuzzle onClick={() => this.props.navigation.navigate('TabThreeScreenFour')} />
              <View title="1" style={styles.row1Item} />
              <MapPuzzle onClick={this.puzzle_click.bind(this, 'E')} />
            </View>
          </View>
        </ScrollView>
        <Modal
          style={[styles.modal]}
          position={"center"}
          ref={"N_modal"}
          isOpen={this.state.isOpen}
        >
          <View style={{flex:1, width:'100%', justifyContent:'center'}}>
            <ScorePuzzle Submit={this.giveScore.bind(this)}/>
            <Button
              title={`Cancel`}
              onPress={() => this.setState({isOpen: false})}
              style={styles.btn}>
           </Button>
         </View>
        </Modal>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777',
  },

  contentContainer:{
    marginTop: Platform.OS == 'ios' ? 25 : 0,
  },

  source: {
    flex: 1,
    width: null,
    height: null,
    alignItems:'center',
    justifyContent:'center',
  },

  map:{
    width:'100%',
    marginTop: 20,
    alignItems: 'center',

  },

  textBold: {
    fontWeight: '500',
    color: '#000',
  },

  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)',
  },

  buttonTouchable: {
    padding: 16,
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

  row1: {
    width: '90%',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignContent: 'center',
    flexWrap: 'nowrap',
  },
  row1Item: {
    flexShrink:1,
    width: '100%',
    height: 60,
    margin: 0.5,
    backgroundColor: 'red',
  }

});