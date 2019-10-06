import '@react-native-firebase/analytics'
import firebase from '@react-native-firebase/app'

import { constants } from '@devhub/core'
import { hideTokenFromString } from '../bugsnag/index.shared'
import { Platform } from '../platform'
import { Analytics, DevHubAnalyticsCustomDimensions } from './'
import { sanitizeDimensions } from './helpers'

export const analytics: Analytics = {
  setUser(userId) {
    firebase.analytics().setUserId(userId || '')
  },

  setDimensions(dimensions) {
    _dimensions = { ..._dimensions, ...dimensions }
    firebase.analytics().setUserProperties(sanitizeDimensions(_dimensions))
  },

  trackEvent(category, action, label, value = 1) {
    firebase
      .analytics()
      .logEvent(hideTokenFromString(action || '')!.replace(/\//g, '_'), {
        event_category: hideTokenFromString(category),
        event_label: hideTokenFromString(label || '')!.substr(0, 100),
        value,
      })
  },

  trackModalView(modalName) {
    this.trackScreenView(`${modalName}_MODAL`)
  },

  trackScreenView(screenName) {
    firebase.analytics().setCurrentScreen(screenName)
  },
}

firebase.analytics().setAnalyticsCollectionEnabled(true)

let _dimensions: Partial<DevHubAnalyticsCustomDimensions> = {
  is_beta: constants.IS_BETA,
  is_dev: __DEV__,
  is_electron: Platform.isElectron,
}

analytics.setDimensions(_dimensions)
