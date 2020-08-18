import {
  constants,
  DevHubHeaders,
  OS,
  Plan,
  Platform,
  PlatformCategory,
} from '@devhub/core'

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

export function getDefaultDevHubHeaders({
  appToken,
}: {
  appToken: string | undefined
}): Record<keyof DevHubHeaders, string> {
  const headers: Record<keyof DevHubHeaders, string> = {
    Authorization: appToken ? `bearer ${appToken}` : '',
    DEVHUB_HOSTNAME: constants.HOSTNAME || '',
    DEVHUB_IS_BETA: `${!!constants.IS_BETA}`,
    DEVHUB_IS_DEV: `${process.env.NODE_ENV !== 'production'}`,
    DEVHUB_IS_LANDING: 'true',
    DEVHUB_PLATFORM_IS_ELECTRON: 'false',
    DEVHUB_PLATFORM_OS: getPlatform(),
    DEVHUB_PLATFORM_REAL_OS: getOSName() || '',
    DEVHUB_VERSION: constants.APP_VERSION,
  }

  return headers
}

export function getTrialTimeLeftLabel(endAt: string) {
  if (!endAt) return ''

  const days = (new Date(endAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  if (days < 0) return 'ended'
  if (days < 1) return `${Math.ceil(days * 24)}h left`
  if (days < 15) return `${Math.ceil(days)}d left`
  if (days < 30) return `${Math.ceil(days / 7)}w left`
  if (days < 11 * 30) return `${Math.ceil(days / 30)}mo left`
  return `${Math.floor(days / 365)}y left`
}

export function toKebabCase(str: string) {
  if (!(str && typeof str === 'string')) return ''

  const matches = str.match(
    /[A-Z]{2,}(?=[A-Z][a-z]+|\b)|[A-Z]?[a-z]+|[A-Z]|[0-9]+/g,
  )
  if (!(matches && matches.length)) return str

  return matches.map(s => s.toLowerCase()).join('-')
}

export function getPurchaseOrSubscribeRoute(
  activePlans: (Plan | undefined)[],
) {
  return activePlans.some(p => !!(p && p.amount > 0 && p.interval))
    ? 'subscribe'
    : 'purchase'
}
