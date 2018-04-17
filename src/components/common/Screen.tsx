import React, { PureComponent, ReactNode } from 'react'
import { StyleSheet, View, ViewStyle } from 'react-native'
import SplashScreen from 'react-native-splash-screen'
import { SafeAreaView } from 'react-navigation'

import Platform from '../../../src/libs/platform'
import theme from '../../styles/themes/dark'

let isSplashScreenVisible = true

export interface IProps {
  children?: ReactNode
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
    useSafeArea: Platform.OS !== 'web',
  }

  componentDidMount() {
    if (isSplashScreenVisible && SplashScreen) {
      SplashScreen.hide()
      isSplashScreenVisible = false
    }
  }

  render() {
    const { useSafeArea, style, ...props } = this.props

    if (useSafeArea && Platform.OS !== 'web')
      return <SafeAreaView {...props} style={[styles.container, style]} />

    return <View {...props} style={[styles.container, style]} />
  }
}
