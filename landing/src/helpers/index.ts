import {
  constants,
  DevHubHeaders,
  OS,
  Plan,
  Platform,
  PlatformCategory,
} from '@brunolemos/devhub-core'

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

export function formatPrice(
  valueInCents: number,
  {
    currency,
    locale = 'en-US',
  }: {
    currency: string
    locale?: string
  },
) {
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency || 'usd',
  })

  const value = formatter.format(valueInCents / 100)
  return value.endsWith('.00') ? value.slice(0, -3) : value
}

export function formatPriceAndInterval(
  valueInCents: number,
  {
    currency,
    interval,
    intervalCount,
    locale = 'en-US',
  }: {
    currency: string
    interval: Plan['interval']
    intervalCount: Plan['intervalCount']
    locale?: string
  },
) {
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency || 'usd',
  })

  const value = formatter.format(valueInCents / 100)
  const priceLabel = value.endsWith('.00') ? value.slice(0, -3) : value

  return `${priceLabel}${
    intervalCount > 1 ? ` every ${intervalCount} ${interval}s` : `/${interval}`
  }`
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
  return `${Math.ceil(days)} days left`
}

export function toKebabCase(str: string) {
  if (!(str && typeof str === 'string')) return ''

  const matches = str.match(
    /[A-Z]{2,}(?=[A-Z][a-z]+|\b)|[A-Z]?[a-z]+|[A-Z]|[0-9]+/g,
  )
  if (!(matches && matches.length)) return str

  return matches.map(s => s.toLowerCase()).join('-')
}
