// @flow

import { Platform } from 'react-native'

function getOSName() {
  if (Platform.OS !== 'web') return Platform.OS

  /* eslint-env browser */
  const userAgent = navigator.userAgent || navigator.vendor || window.opera

  if (/android/i.test(userAgent)) {
    return 'android'
  }

  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    return 'ios'
  }

  return 'web'
}

Platform.isStandalone = window.navigator.standalone

Platform.realOS = getOSName()

Platform.selectUsingRealOS = (obj: {
  android?: any,
  ios?: any,
  web?: any,
  default?: any,
}) =>
  Platform.realOS in obj
    ? obj[Platform.realOS]
    : 'web' in obj ? obj.web : obj.default

export default Platform
