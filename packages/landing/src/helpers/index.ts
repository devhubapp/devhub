import { OS, Platform, PlatformCategory } from '../types'

export function aspectRatioToStyle(ratio: number) {
  return {
    width: '100%',
    paddingTop: `${(100 / ratio).toFixed(2)}%`,
  }
}

export function getPlatform(): Platform {
  const userAgent =
    typeof navigator === 'undefined' || typeof window === 'undefined'
      ? ''
      : navigator.userAgent || navigator.vendor || (window as any).opera || ''

  if (/android/i.test(userAgent)) return 'android'

  if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream)
    return 'ios'

  return 'web'
}

export function getOSName(): OS | undefined {
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

export function getPlatformCategory(): PlatformCategory {
  const os = getOSName()

  switch (os) {
    case 'android':
      return 'mobile'

    case 'ios':
      return 'mobile'

    case 'linux':
      return 'desktop'

    case 'macos':
      return 'desktop'

    case 'windows':
      return 'desktop'

    default:
      return 'web'
  }
}

export function getSystemLabel(name: Platform | OS | '') {
  switch (name) {
    case 'android':
      return 'Android'

    case 'ios':
      return 'iOS'

    case 'linux':
      return 'Linux'

    case 'macos':
      return 'macOS'

    case 'web':
      return 'Web'

    case 'windows':
      return 'Windows'

    default:
      return ''
  }
}
