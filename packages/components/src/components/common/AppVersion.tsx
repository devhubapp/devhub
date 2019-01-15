import React from 'react'
import { StyleSheet } from 'react-native'

import { useAnimatedTheme } from '../../hooks/use-animated-theme'
import { AnimatedText } from '../animated/AnimatedText'

const pkg = require('@devhub/core/package.json') // tslint:disable-line

export const appVersion = pkg.version

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
    <AnimatedText
      style={[styles.appVersion, { color: theme.foregroundColorMuted50 }]}
    >{`v${appVersion}`}</AnimatedText>
  )
}
