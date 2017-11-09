import React, { Component } from 'react'
import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native'

export interface IProps {}

export interface IState {}

export default class App extends Component<IProps, IState> {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to React Native</Text>
        <Text style={styles.instructions}>To get started, edit index.js</Text>
        <Text style={styles.instructions}>Using Typescript</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    flex: 1,
    justifyContent: 'center',
  } as ViewStyle,

  welcome: {
    fontSize: 20,
    margin: 10,
    textAlign: 'center',
  } as TextStyle,

  instructions: {
    color: '#333333',
    marginBottom: 5,
    textAlign: 'center',
  } as TextStyle,
})
