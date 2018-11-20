import React from 'react'
import { StyleSheet, Text } from 'react-native'

import { ThemeConsumer } from '../context/ThemeContext'

const pkg = require('shared-core/package.json') // tslint:disable-line

const styles = StyleSheet.create({
  appVersion: {
    alignSelf: 'center',
    fontSize: 14,
    lineHeight: 18,
    textAlign: 'center',
  },
})

export function AppVersion() {
  return (
    <ThemeConsumer>
      {({ theme }) => (
        <Text
          style={[
            styles.appVersion,
            { color: theme.foregroundColorTransparent50 },
          ]}
        >{`v${pkg.version}`}</Text>
      )}
    </ThemeConsumer>
  )
}
