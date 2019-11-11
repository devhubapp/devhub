import React from 'react'
import { StyleSheet } from 'react-native'

import { constants } from '@devhub/core'
import { Link } from './Link'

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
  if (!(constants.APP_VERSION && typeof constants.APP_VERSION === 'string'))
    return null

  return (
    <Link
      analyticsLabel="app_version"
      href="https://github.com/devhubapp/devhub/releases"
      openOnNewTab
      style={styles.appVersionLink}
      textProps={{
        color: 'foregroundColorMuted65',
        style: styles.appVersion,
      }}
    >
      {getAppVersionLabel()}
    </Link>
  )
}

export function getAppVersionLabel() {
  const buildNumber = 2567

  return `v${constants.APP_VERSION}${
    constants.IS_BETA && !constants.APP_VERSION.includes('beta')
      ? ` (beta build ${buildNumber})`
      : ` (build ${buildNumber})`
  }`
}
