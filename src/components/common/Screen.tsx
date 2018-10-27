import { darken } from 'polished'
import React, { PureComponent, ReactNode } from 'react'
import { StatusBar, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import SplashScreen from 'react-native-splash-screen'
import { SafeAreaView } from 'react-navigation'

import { Platform } from '../../libs/platform'
import { ThemeConsumer } from '../context/ThemeContext'

let isSplashScreenVisible = true

export interface ScreenProps {
  children?: ReactNode
  statusBarBackgroundColor?: string
  style?: StyleProp<ViewStyle>
  // useSafeArea?: boolean
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    flex: 1,
  } as ViewStyle,
})

export class Screen extends PureComponent<ScreenProps> {
  // static defaultProps = {
  //   useSafeArea: true,
  // }

  componentDidMount() {
    if (isSplashScreenVisible && SplashScreen) {
      SplashScreen.hide()
      isSplashScreenVisible = false
    }
  }

  renderContent({ style, ...props }: ScreenProps) {
    // if (useSafeArea)
    //   return <SafeAreaView {...props} style={[styles.container, style]} />

    return <View {...props} style={[styles.container, style]} />
  }

  render() {
    const { statusBarBackgroundColor } = this.props

    const createStatusBarPlaceholder =
      Platform.OS === 'ios' && !!statusBarBackgroundColor

    return (
      <ThemeConsumer>
        {({ theme }) => (
          <>
            <StatusBar
              barStyle={theme.isDark ? 'light-content' : 'dark-content'}
              backgroundColor={statusBarBackgroundColor}
              translucent={createStatusBarPlaceholder}
            />

            {createStatusBarPlaceholder && (
              <View
                style={{
                  width: '100%',
                  height: StatusBar.currentHeight || 21,
                  backgroundColor: statusBarBackgroundColor,
                }}
              />
            )}

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
