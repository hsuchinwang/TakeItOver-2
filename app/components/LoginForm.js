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

const background = require("../images/login1_bg.png");
const mark = require("../images/login1_mark.png");
const lockIcon = require("../images/login1_lock.png");
const personIcon = require("../images/login1_person.png");

const renderNameInput = ({ input: { onChange, ...restInput }}) => {
  return <TextInput placeholder="Username" placeholderTextColor="#FFF" style={styles.input} onChangeText={onChange} {...restInput} />
}
const renderPassWordInput = ({ input: { onChange, ...restInput }}) => {
  return <TextInput placeholderTextColor="#FFF" placeholder="Password" style={styles.input} secureTextEntry onChangeText={onChange} {...restInput} />
}

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
  }
  // const { handleSubmit } = this.props
  render() {
  return (
      <View style={styles.container}>
        <Image source={background} style={styles.background} resizeMode="cover">
          <View style={styles.markWrap}>
            <Image source={mark} style={styles.mark} resizeMode="contain" />
          </View>
          <View style={styles.wrapper}>
            <View style={styles.inputWrap}>
              <View style={styles.iconWrap}>
                <Image source={personIcon} style={styles.icon} resizeMode="contain" />
              </View>
              <Field name="username" component={renderNameInput} />
            </View>
            <View style={styles.inputWrap}>
              <View style={styles.iconWrap}>
                <Image source={lockIcon} style={styles.icon} resizeMode="contain" />
              </View>
              <Field name="password" component={renderPassWordInput} />
            </View>
            <TouchableOpacity activeOpacity={.5} onPress={() => Alert.alert('去問你的隊輔XD')}>
              <View>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </View>
            </TouchableOpacity>
            {(this.props.wrong) && (<TouchableOpacity activeOpacity={.5}><View><Text style={styles.wrongPasswordText}>帳號或密碼錯誤</Text></View></TouchableOpacity>)}
            <TouchableOpacity activeOpacity={.5} onPress={this.props.handleSubmit(this.props.Submit)}>
              <View style={styles.button}>
                <Text style={styles.buttonText}>登入</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.container}>
            <View style={styles.signupWrap}>
            </View>
          </View>
        </Image>
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
  form: 'Login' // a unique name for this form
})(LoginForm);