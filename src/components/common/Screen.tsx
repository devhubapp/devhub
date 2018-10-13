import { darken } from 'polished'
import React, { PureComponent, ReactNode } from 'react'
import { StatusBar, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import SplashScreen from 'react-native-splash-screen'
import { SafeAreaView } from 'react-navigation'

import { ThemeConsumer } from '../context/ThemeContext'

let isSplashScreenVisible = true

export interface ScreenProps {
  children?: ReactNode
  useSafeArea?: boolean
  style?: StyleProp<ViewStyle>
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    flex: 1,
  } as ViewStyle,
})

export default class Screen extends PureComponent<ScreenProps> {
  static defaultProps = {
    useSafeArea: true,
  }

  componentDidMount() {
    if (isSplashScreenVisible && SplashScreen) {
      SplashScreen.hide()
      isSplashScreenVisible = false
    }
  }

  renderContent({ useSafeArea, style, ...props }: ScreenProps) {
    if (useSafeArea)
      return <SafeAreaView {...props} style={[styles.container, style]} />

    return <View {...props} style={[styles.container, style]} />
  }

  render() {
    return (
      <ThemeConsumer>
        {({ theme }) => (
          <>
            <StatusBar
              barStyle={theme.isDark ? 'light-content' : 'dark-content'}
            />

            {this.renderContent({
              ...this.props,
              style: [
                this.props.style,
                { backgroundColor: darken(0.01, theme.backgroundColor) },
              ],
            })}
          </>
        )}
      </ThemeConsumer>
    )
  }
}
