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

const Home = ({ navigation }) => (
  <View style={styles.container}>
    <Text style={styles.welcome}>
        首頁
    </Text>
    <Button
      onPress={() => navigation.dispatch({ type: 'Puzzle' })}
      title="解謎"
    />
  </View>
);

Home.propTypes = {
  navigation: PropTypes.object.isRequired,
};

Home.navigationOptions = {
  title: 'Take It Over',
};

export default Home;
