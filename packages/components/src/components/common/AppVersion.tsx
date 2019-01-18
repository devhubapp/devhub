import React from 'react'
import { StyleSheet } from 'react-native'

import { useCSSVariablesOrSpringAnimatedTheme } from '../../hooks/use-css-variables-or-spring--animated-theme'
import { SpringAnimatedText } from '../animated/spring/SpringAnimatedText'

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
  const springAnimatedTheme = useCSSVariablesOrSpringAnimatedTheme()

  return (
    <SpringAnimatedText
      style={[
        styles.appVersion,
        { color: springAnimatedTheme.foregroundColorMuted50 },
      ]}
    >{`v${appVersion}`}</SpringAnimatedText>
  )
}
