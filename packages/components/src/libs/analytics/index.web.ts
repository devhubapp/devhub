import _ from 'lodash'

import { constants } from '@devhub/core'
import { Platform } from '../platform'
import { Analytics, DevHubAnalyticsCustomDimensions } from './'
import { formatDimensions } from './helpers'

const trackingId = 'UA-52350759-2'
gtag('config', trackingId, {
  app_version: constants.APP_VERSION,
  app_name: __DEV__ ? 'devhub-dev' : 'devhub',
  custom_map: {
    dimension1: 'user_id',
    dimension2: 'is_electron',
    dimension3: 'theme_id',
    dimension4: 'is_beta',
    dimension6: 'is_dev',
    dimension7: 'light_theme_id',
    dimension8: 'dark_theme_id',
  } as Record<string, keyof DevHubAnalyticsCustomDimensions>,
})

let _dimensions: DevHubAnalyticsCustomDimensions = {
  is_beta: constants.IS_BETA,
  is_dev: __DEV__,
  is_electron: Platform.isElectron,
}

// if (__DEV__) {
//   ;(window as any)[`ga-disable-${trackingId}`] = true
// }

const gtagAndLog = (...args: any[]) => {
  // if (__DEV__) console.debug('[ANALYTICS]', ...args) // tslint:disable-line no-console
  gtag(...args)
}

export const analytics: Analytics = {
  setUser(userId) {
    _dimensions.user_id = userId || ''
    gtagAndLog('set', { user_id: _dimensions.user_id })
  },

  setDimensions(dimensions) {
    _dimensions = { ..._dimensions, ...dimensions }
    gtagAndLog('set', formatDimensions(dimensions))
  },

  trackEvent(category, action, label, value, payload) {
    gtagAndLog('event', action, {
      event_category: category,
      event_label: label,
      value,
      ...payload,
    })
  },

  trackModalView(modalName) {
    this.trackScreenView(`${modalName}_MODAL`)
  },

  trackScreenView(screenName) {
    gtagAndLog('event', 'screen_view', { screen_name: screenName })
  },
}

analytics.setDimensions(_dimensions)
