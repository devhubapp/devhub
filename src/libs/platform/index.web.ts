import { Platform as _Platform } from 'react-native'

import {
  PlataformSelectSpecifics,
  PlatformOSType,
  PlatformSelectOptions,
} from './index.shared'

function getOSName(): PlatformOSType {
  const userAgent =
    navigator.userAgent || navigator.vendor || (window as any).opera

  if (/android/i.test(userAgent)) return 'android'
  if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream)
    return 'ios'
  return 'web'
}

const realOS = getOSName()

export const Platform = {
  realOS,
  ..._Platform,
  isStandalone: (window.navigator as any).standalone,
  selectUsingRealOS<T>(
    specifics: PlataformSelectSpecifics<T>,
    { fallbackToWeb = true }: PlatformSelectOptions = {},
  ) {
    const result =
      Platform.realOS in specifics
        ? specifics[realOS]
        : fallbackToWeb && 'web' in specifics
          ? specifics.web
          : specifics.default

    return result
  },
}
