import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';

export default class Puzzle extends Component {
    render() {
      let BgColor = "";
      if(this.props.P_result == 'W') BgColor = "red"
      if(this.props.P_result == 'L') BgColor = "blue"
      if(this.props.P_result == 'N') BgColor = "yellow"
        return (
          <TouchableOpacity
            onPress={this.props.onClick}
            style={{
              flexShrink:1,
              width: '100%',
              height: 150,
              margin: 0.5,
              backgroundColor: BgColor,
            }}>
            <Text>{''}</Text>
          </TouchableOpacity>
        )
    }
}

// const styles = StyleSheet.create({
//   row1Item: {
//     flexShrink:1,
//     width: '100%',
//     height: 50,
//     margin: 0.5,
//   },
//   bg: {
//     backgroundColor: BgColor,
//   }
// });
