import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { View, Text, StyleSheet, TouchableOpacity, TextInput} from 'react-native';

const renderNameInput = ({ input: { onChange, ...restInput }}) => {
  return <TextInput style={styles.input} onChangeText={onChange} {...restInput} />
}
const renderPassWordInput = ({ input: { onChange, ...restInput }}) => {
  return <TextInput secureTextEntry={true} style={styles.input} onChangeText={onChange} {...restInput} />
}

const LoginForm = props => {
  const { handleSubmit } = props
  return (
    <View style={styles.container}>
      <Text>帳號:</Text>
      <Field name="username" component={renderNameInput} />
      <Text>密碼:</Text>
      <Field name="password" component={renderPassWordInput} />
      <TouchableOpacity onPress={handleSubmit(props.Submit)}>
        <Text style={styles.button}>Submit</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'blue',
    color: 'white',
    height: 30,
    lineHeight: 30,
    marginTop: 10,
    textAlign: 'center',
    width: 250
  },
  container: {
    flex:1,
    justifyContent:'center',
    alignItems: 'center'
  },
  input: {
    borderColor: 'black',
    borderWidth: 1,
    height: 37,
    width: 250
  }
})

// Decorate the form component
export default reduxForm({
  form: 'Login' // a unique name for this form
})(LoginForm);