import React from 'react'
import { Animated, StyleSheet } from 'react-native'

import { useAnimatedTheme } from '../../hooks/use-animated-theme'

const pkg = require('@devhub/core/package.json') // tslint:disable-line

const styles = StyleSheet.create({
  appVersion: {
    alignSelf: 'center',
    fontSize: 14,
    lineHeight: 18,
    textAlign: 'center',
  },
})

export function AppVersion() {
  const theme = useAnimatedTheme()

  return (
    <Animated.Text
      style={[styles.appVersion, { color: theme.foregroundColorTransparent50 }]}
    >{`v${pkg.version}`}</Animated.Text>
  )
}
