import React, { PropTypes } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});

const Puzzle = ({ navigation }) => (
  <View style={styles.container}>
    <Text style={styles.welcome}>
        解謎
    </Text>
    <Button
      onPress={() => navigation.dispatch({ type: 'Home' })}
      title="首頁"
    />
  </View>
);

Puzzle.propTypes = {
  navigation: PropTypes.object.isRequired,
};

Puzzle.navigationOptions = {
  title: '九宮格解謎',
};

export default Puzzle;
