import { darken } from 'polished'
import React, { PureComponent, ReactNode } from 'react'
import {
  SafeAreaView,
  StatusBar,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native'
import SplashScreen from 'react-native-splash-screen'

import { ThemeConsumer } from '../context/ThemeContext'

let isSplashScreenVisible = true

export interface ScreenProps {
  children?: ReactNode
  statusBarBackgroundColor?: string
  style?: StyleProp<ViewStyle>
  useSafeArea?: boolean
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    flex: 1,
  } as ViewStyle,
})

export class Screen extends PureComponent<ScreenProps> {
  static defaultProps = {
    useSafeArea: true,
  }

  componentDidMount() {
    if (isSplashScreenVisible && SplashScreen) {
      SplashScreen.hide()
      isSplashScreenVisible = false
    }
  }

  renderContent({ style, useSafeArea, ...props }: ScreenProps) {
    if (useSafeArea) {
      return <SafeAreaView {...props} style={[styles.container, style]} />
    }

    return <View {...props} style={[styles.container, style]} />
  }

  render() {
    const { statusBarBackgroundColor } = this.props

    return (
      <ThemeConsumer>
        {({ theme }) => (
          <>
            <StatusBar
              barStyle={theme.isDark ? 'light-content' : 'dark-content'}
              backgroundColor={
                statusBarBackgroundColor || theme.backgroundColor
              }
            />

            <View style={{ flex: 1, backgroundColor: 'red' }}>
              {this.renderContent({
                ...this.props,
                style: [
                  this.props.style,
                  { backgroundColor: darken(0.01, theme.backgroundColor) },
                ],
              })}
            </View>
          </>
        )}
      </ThemeConsumer>
    )
  }
}
