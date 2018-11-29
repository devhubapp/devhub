import { darken } from 'polished'
import React, { ReactNode } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { useTheme } from '../context/ThemeContext'

export interface ScreenProps {
  children?: ReactNode
  style?: StyleProp<ViewStyle>
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    flex: 1,
  },
})

export function Screen(props: ScreenProps) {
  const theme = useTheme()

  return (
    <View
      {...props}
      style={[
        styles.container,
        props.style,
        { backgroundColor: darken(0.01, theme.backgroundColor) },
      ]}
    />
  )
}
