import { Platform as _Platform } from 'react-native'

import {
  PlataformSelectSpecificsEnhanced,
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

// https://stackoverflow.com/a/4819886/2228575
function supportsTouchInput() {
  if ('ontouchstart' in window) {
    return true
  }

  const prefixes = ' -webkit- -moz- -o- -ms- '.split(' ')
  const query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('')

  const mq = (q: string) => window.matchMedia(q).matches
  return mq(query)
}

function getOSName(): PlatformRealOS | undefined {
  const userAgent =
    typeof navigator === 'undefined' || typeof window === 'undefined'
      ? ''
      : navigator.userAgent || navigator.vendor || (window as any).opera || ''

  if (/android/i.test(userAgent)) return 'android'

  if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream)
    return 'ios'

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
  supportsTouch: supportsTouchInput(),
}
