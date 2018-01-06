import { Platform as _Platform } from 'react-native'

function getOSName(): 'android' | 'ios' | 'web' {
  const userAgent =
    navigator.userAgent || navigator.vendor || (window as any).opera

  if (/android/i.test(userAgent)) return 'android'
  if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream)
    return 'ios'
  return 'web'
}

const realOS = getOSName()

const Platform = {
  realOS,
  ..._Platform,
  isStandalone: (window.navigator as any).standalone,
  selectUsingRealOS: (obj: {
    android?: any
    ios?: any
    web?: any
    default?: any
  }) =>
    Platform.realOS in obj ? obj[realOS] : 'web' in obj ? obj.web : obj.default,
}

export default Platform
