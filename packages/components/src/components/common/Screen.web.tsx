import React, { ReactNode } from 'react'
import { Animated, StyleProp, StyleSheet, ViewStyle } from 'react-native'

import { ThemeColors } from '@devhub/core'
import { useAnimatedTheme } from '../../hooks/use-animated-theme'
import { Helmet } from '../../libs/helmet'
import { useTheme } from '../context/ThemeContext'

export interface ScreenProps {
  children?: ReactNode
  statusBarBackgroundThemeColor?: keyof ThemeColors
  style?: StyleProp<ViewStyle>
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    flex: 1,
  },
})

export const Screen = React.memo((props: ScreenProps) => {
  const animatedTheme = useAnimatedTheme()
  const theme = useTheme()

  const { statusBarBackgroundThemeColor } = props

  return (
    <>
      <Helmet>
        <meta
          name="theme-color"
          content={
            statusBarBackgroundThemeColor
              ? theme[statusBarBackgroundThemeColor]
              : theme.backgroundColor
          }
        />
        <meta
          name="msapplication-navbutton-color"
          content={
            statusBarBackgroundThemeColor
              ? theme[statusBarBackgroundThemeColor]
              : theme.backgroundColor
          }
        />
      </Helmet>

      <Animated.View
        {...props}
        style={[
          styles.container,
          props.style,
          { backgroundColor: animatedTheme.backgroundColor },
        ]}
      />
    </>
  )
})
