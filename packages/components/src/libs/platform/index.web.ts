import { Platform as _Platform } from 'react-native'

import {
  PlataformSelectSpecifics,
  PlatformOSType,
  PlatformSelectOptions,
} from './index.shared'

// From: https://github.com/cheton/is-electron
function isElectron() {
  if (
    typeof window !== 'undefined' &&
    typeof window.process === 'object' &&
    window.process.type === 'renderer'
  ) {
    return true
  }

  if (
    typeof process !== 'undefined' &&
    typeof process.versions === 'object' &&
    !!process.versions.electron
  ) {
    return true
  }

  if (
    typeof navigator === 'object' &&
    typeof navigator.userAgent === 'string' &&
    navigator.userAgent.indexOf('Electron') >= 0
  ) {
    return true
  }

  return false
}

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
  isElectron: isElectron(),
  isStandalone: (window.navigator as any).standalone,
  selectUsingRealOS<T>(
    specifics: PlataformSelectSpecifics<T>,
    { fallbackToWeb = false }: PlatformSelectOptions = {},
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
