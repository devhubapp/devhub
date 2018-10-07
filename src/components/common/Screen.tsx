import React, { PureComponent, ReactNode } from 'react'
import { StatusBar, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import SplashScreen from 'react-native-splash-screen'
import { SafeAreaView } from 'react-navigation'

import theme from '../../styles/themes/dark'

let isSplashScreenVisible = true

export interface IProps {
  children?: ReactNode
  useSafeArea?: boolean
  style?: StyleProp<ViewStyle>
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
    if (isSplashScreenVisible && SplashScreen) {
      SplashScreen.hide()
      isSplashScreenVisible = false
    }
  }

  renderContent() {
    const { useSafeArea, style, ...props } = this.props

    if (useSafeArea)
      return <SafeAreaView {...props} style={[styles.container, style]} />

    return <View {...props} style={[styles.container, style]} />
  }

  render() {
    return (
      <>
        <StatusBar barStyle="light-content" />
        {this.renderContent()}
      </>
    )
  }
}
