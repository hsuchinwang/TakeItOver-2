import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';

import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TextInput,
  Button,
  TouchableOpacity,
  Alert,
} from 'react-native';
const { width, height } = Dimensions.get("window");

const renderNameInput = ({ input: { onChange, ...restInput }}) => {
  return <TextInput placeholder="關主密碼" placeholderTextColor="#FFF" style={styles.input} onChangeText={onChange} {...restInput} />
}
const renderPassWordInput = ({ input: { onChange, ...restInput }}) => {
  return <TextInput placeholder="K寶" placeholderTextColor="#FFF"  style={styles.input} secureTextEntry onChangeText={onChange} {...restInput} />
}

class ScorePuzzle extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
  return (
      <View style={styles.container}>
        <View style={styles.inputWrap}>
          <Field name="username" component={renderNameInput} />
        </View>
        <View style={styles.inputWrap}>
        <Field name="password" component={renderPassWordInput} />
        </View>
        <TouchableOpacity activeOpacity={.5} onPress={this.props.handleSubmit(this.props.Submit)}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>登入</Text>
            </View>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  markWrap: {
    flex: 1,
    paddingVertical: 30,
  },
  mark: {
    width: null,
    height: null,
    flex: 1,
  },
  background: {
    width,
    height,
  },
  wrapper: {
    paddingVertical: 30,
  },
  inputWrap: {
    flexDirection: "row",
    marginVertical: 10,
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: "#CCC"
  },
  iconWrap: {
    paddingHorizontal: 7,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    height: 20,
    width: 20,
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: "#FF3366",
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
  },
  forgotPasswordText: {
    color: "#D8D8D8",
    backgroundColor: "transparent",
    textAlign: "right",
    paddingRight: 15,
  },
  wrongPasswordText: {
    color: "#D20000",
    backgroundColor: "transparent",
    textAlign: "right",
    paddingRight: 15,
    marginTop:5,
  },
  signupWrap: {
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  accountText: {
    color: "#D8D8D8"
  },
  signupLinkText: {
    color: "#FFF",
    marginLeft: 5,
  }
});

// Decorate the form component
export default reduxForm({
  form: 'ScorePuzzle' // a unique name for this form
})(ScorePuzzle);