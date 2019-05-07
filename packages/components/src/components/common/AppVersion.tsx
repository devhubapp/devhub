import React from 'react'
import { StyleSheet } from 'react-native'

import { Link } from './Link'

const pkg = require('@devhub/core/package.json') // tslint:disable-line

export const appVersion = pkg.version

const styles = StyleSheet.create({
  appVersionLink: {
    alignSelf: 'center',
  },

  appVersion: {
    alignSelf: 'center',
    fontSize: 14,
    lineHeight: 18,
    textAlign: 'center',
  },
})

export function AppVersion() {
  return (
    <Link
      analyticsLabel="app_version"
      href="https://github.com/devhubapp/devhub/releases"
      openOnNewTab
      style={styles.appVersionLink}
      textProps={{
        color: 'foregroundColorMuted50',
        style: styles.appVersion,
      }}
    >
      {`v${appVersion}`}
    </Link>
  )
}
