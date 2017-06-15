import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
export default class MapPuzzle extends Component {
    render() {
        return (
          <TouchableOpacity
            onPress={this.props.onClick}
            style={styles.rowItem}>
            <Text>{''}</Text>
          </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    rowItem: {
      flexShrink:1,
      width: '100%',
      height: 60,
      margin: 0.5,
      backgroundColor: 'transparent',
    },
});
