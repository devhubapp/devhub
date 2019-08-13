import { Platform as _Platform } from 'react-native'

import {
  PlataformSelectSpecificsEnhanced,
  PlatformName,
  PlatformRealOS,
  PlatformSelectOptions,
} from './index.shared'

// From: https://github.com/cheton/is-electron
function isElectron() {
  if (
    !(typeof window !== 'undefined' && window.devhub === true && !!window.ipc)
  ) {
    return false
  }

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

function getPlatform(): PlatformName {
  const userAgent =
    typeof navigator === 'undefined' || typeof window === 'undefined'
      ? ''
      : navigator.userAgent || navigator.vendor || (window as any).opera || ''

  if (/android/i.test(userAgent)) return 'android'

  if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream)
    return 'ios'

  return 'web'
}

function getOSName(): PlatformRealOS | undefined {
  const os = getPlatform()
  if (os === 'ios' || os === 'android') return os

  const platform =
    typeof navigator === 'undefined'
      ? ''
      : `${navigator.platform || ''}`.toLowerCase().trim()

  if (platform.startsWith('mac')) return 'macos'
  if (platform.startsWith('win')) return 'windows'
  if (platform.startsWith('linux')) return 'linux'

  return undefined
}

const realOS = getOSName() || 'web'

export const Platform = {
  realOS,
  ..._Platform,
  isElectron: isElectron(),
  isStandalone: (window.navigator as any).standalone,
  selectUsingRealOS<T>(
    specifics: PlataformSelectSpecificsEnhanced<T>,
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
