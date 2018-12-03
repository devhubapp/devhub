import React from 'react'
import { StyleSheet, Text } from 'react-native'

import { useTheme } from '../context/ThemeContext'

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
  const theme = useTheme()

  return (
    <Text
      style={[styles.appVersion, { color: theme.foregroundColorTransparent50 }]}
    >{`v${pkg.version}`}</Text>
  )
}
