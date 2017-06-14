'use strict'
import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Platform } from 'react-native';
import BackgroundImage from '../../components/BackgroundImage';
import AppIntro from 'react-native-app-intro';
export default class TabOneScreenThree extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title:'行程表',
      headerTitleStyle:{
        alignSelf: 'center',
        marginLeft: -20,
      },
      headerLeft: (
        <Ionicons.Button name="ios-menu" color="#185ffe" style={{marginLeft:13}}backgroundColor="#eeeef2" onPress={() => navigation.navigate('DrawerOpen')}>
        </Ionicons.Button>
      ),
      drawerLabel: '行程表',
      drawerIcon: ({ tintColor }) => (
        <Ionicons
          name={'md-clipboard'}
          size={Platform == 'ios' ? 26 : 20}
          style={{ color: tintColor }}
        />
      ),
    }
  };
  onSkipBtnHandle = (index) => {
    Alert.alert('Skip');
    console.log(index);
  }
  doneBtnHandle = () => {
    Alert.alert('Done');
  }
  nextBtnHandle = (index) => {
    Alert.alert('Next');
    console.log(index);
  }
  onSlideChangeHandle = (index, total) => {
    console.log(index, total);
  }
  render() {
    const pageArray = [{
      title: '賢者的分享時間-鄭俊德',
      description: '閱讀社群創辦人；18歲罹患的一場大病，讓鄭俊德對於生命所追求的價值起了變化，醫學工程畢業的他，放棄穩定的醫療業務工作，在臉書創辦了閱讀社群；一開始只是單純分享自己閱讀到的好故事，沒想到還感動讀者，紛紛投稿分享，開始寫出自己的故事。至今，閱讀社群目前有近百萬粉絲、千位創作者，累積文章達數萬篇，包括詩、時事評論、還有更多故事。他們辦讀書會，設計桌遊、運動、喝下午茶等方式，交換讀書心得；也做公益，淨灘、幫助偏鄉弱勢。他深信，每個人在閱讀中都能找到屬於自己生命的答案。',
      img: require('../../images/workshop/A鄭俊德.jpg'),
      imgStyle: {
        height: 80 * 2.5,
        width: 109 * 2.5,
      },
      backgroundColor: '#2c2f30',
      fontColor: '#fff',
      level: 10,
    }, {
      title: 'Page 2',
      description: 'Description 2',
      img: require('../../images/workshop/A鄭俊德.jpg'),
      imgStyle: {
        height: 80 * 2.5,
        width: 109 * 2.5,
      },
      backgroundColor: '#2c2f30',
      fontColor: '#fff',
      level: 10,
    }];
    return(
      <AppIntro
        onNextBtnClick={this.nextBtnHandle}
        onDoneBtnClick={this.doneBtnHandle}
        onSkipBtnClick={this.onSkipBtnHandle}
        onSlideChange={this.onSlideChangeHandle}
        pageArray={pageArray}
      />
    )
  }
}
const styles = StyleSheet.create({
    text: {
        textAlign: 'center',
        color: 'white',
        backgroundColor: 'rgba(0,0,0,0)',
        fontSize: 32
    }
});