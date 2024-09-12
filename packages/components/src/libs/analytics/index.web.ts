import { constants } from '@devhub/core'
import { hideTokenFromString } from '../bugsnag/index.shared'
import { Platform } from '../platform'
import { Analytics, DevHubAnalyticsCustomDimensions } from './'
import { sanitizeDimensionValue } from './helpers'

export const analytics: Analytics = {
  setUser(userId) {
    ga('set', 'userId', sanitizeDimensionValue(userId))
    ga('set', dimensionsMapper.user_id, sanitizeDimensionValue(userId))
  },

  setDimensions(dimensions) {
    if (!dimensions) return

    Object.entries(dimensions).forEach(([key, value]) => {
      const dimensionN = (dimensionsMapper as any)[key]
      if (!dimensionN) return

      ga('set', dimensionN, sanitizeDimensionValue(value))
    })
  },

  trackEvent(category, action, label, value = 1) {
    ga('send', 'event', {
      eventCategory: hideTokenFromString(category),
      eventAction: hideTokenFromString(action),
      eventLabel: hideTokenFromString(label || '')!.slice(0, 100),
      eventValue: value,
    })
  },

  trackModalView(modalName) {
    this.trackScreenView(`${modalName}_MODAL`)
  },

  trackScreenView(screenName) {
    ga('send', 'screenview', { screenName })
  },
}

const trackingId = 'UA-52350759-2'

const dimensionsMapper = {
  user_id: 'dimension1',
  is_electron: 'dimension2',
  theme_id: 'dimension3',
  is_beta: 'dimension4',
  is_dev: 'dimension6',
  light_theme_id: 'dimension7',
  dark_theme_id: 'dimension8',
  plan_amount: 'dimension9',
} as Record<keyof DevHubAnalyticsCustomDimensions, string>

// some changes are required to make ga work with the electron app
// because it uses the file:// protocol instead of https://
if (
  Platform.isElectron ||
  !window.location.hostname ||
  !(
    window.location.protocol === 'http:' ||
    window.location.protocol === 'https:'
  )
) {
  // https://stackoverflow.com/a/47251006/2228575 s
  ga('create', trackingId, {
    clientId: localStorage.getItem('ga:clientId'),
    storage: 'none',
  } as UniversalAnalytics.FieldsObject)
  ga((tracker) => {
    const clientId = tracker && tracker.get('clientId')
    if (clientId) localStorage.setItem('ga:clientId', clientId)
  })

  // https://stackoverflow.com/a/33766727/2228575
  ga('set', 'checkProtocolTask', null) // disable file protocol checking
  ga('set', 'checkStorageTask', null) // disable cookie storage checking
  ga('set', 'historyImportTask', null) // disable history checking (requires reading from cookies)

  ga('set', 'page', '/')
} else {
  ga('create', trackingId, 'auto')
}

ga('set', 'appVersion', constants.APP_VERSION)
ga('set', 'appName', __DEV__ ? 'devhub-dev' : 'devhub')

analytics.setDimensions({
  is_beta: constants.IS_BETA,
  is_dev: __DEV__,
  is_electron: Platform.isElectron,
})
ga('send', 'pageview')
