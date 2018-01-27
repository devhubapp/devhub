import React, { PureComponent, ReactNode } from 'react'
import { SafeAreaView, StyleSheet, View, ViewStyle } from 'react-native'
import SplashScreen from 'react-native-splash-screen'

import theme from '../../styles/themes/dark'

let isSplashScreenVisible = true

export interface IProps {
  children: ReactNode
  useSafeArea?: boolean
  style?: ViewStyle
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.base00,
    flex: 1,
  } as ViewStyle,
})

export default class Screen extends PureComponent<IProps> {
  static defaultProps = {
    useSafeArea: true,
  }

  componentDidMount() {
    if (isSplashScreenVisible) {
      SplashScreen.hide()
      isSplashScreenVisible = false
    }
  }

  render() {
    const { useSafeArea, ...props } = this.props

    if (useSafeArea)
      return <SafeAreaView {...props} style={[styles.container, props.style]} />

    return <View {...props} style={[styles.container, props.style]} />
  }
}
