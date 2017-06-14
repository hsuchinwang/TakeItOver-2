import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
export default class Puzzle extends Component {
    render() {
        return (
          <TouchableOpacity
            onPress={this.props.onClick}
            style={styles.row1Item}>
            <Text>{''}</Text>
          </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    row1Item: {
      flexShrink:1,
      width: '100%',
      height: 50,
      margin: 0.5,
      backgroundColor: 'red',
    },
});
