import _ from 'lodash'
import * as firebase from 'react-native-firebase'
import {
  GoogleAnalyticsSettings,
  GoogleAnalyticsTracker,
} from 'react-native-google-analytics-bridge'

import { constants } from '@devhub/core'
import { Platform } from '../platform'
import { Analytics, DevHubAnalyticsCustomDimensions } from './'

GoogleAnalyticsSettings.setDryRun(false) // __DEV__
GoogleAnalyticsSettings.setDispatchInterval(5)
firebase.analytics().setAnalyticsCollectionEnabled(true) // !__DEV__

const tracker = new GoogleAnalyticsTracker('UA-52350759-2')
tracker.setAppName(__DEV__ ? 'devhub-dev' : 'devhub')
tracker.setAppVersion(constants.APP_VERSION)
tracker.customDimensionsFieldsIndexMap = {
  user_id: 1,
  is_electron: 2,
  theme_id: 3,
  is_beta: 4,
  layout_mode: 5,
  is_dev: 6,
  light_theme_id: 7,
  dark_theme_id: 8,
} as Record<keyof DevHubAnalyticsCustomDimensions, number>

let _dimensions: DevHubAnalyticsCustomDimensions = {
  is_beta: constants.IS_BETA,
  is_dev: __DEV__,
  is_electron: Platform.isElectron,
}

function log(..._args: any[]) {
  // console.log('[ANALYTICS]', ...args) // tslint:disable-line no-console
}

function getFormatedDimensions() {
  return _.mapValues(_dimensions, d => {
    if (typeof d === 'string') return d
    if (d || d === false) return `${d}`
    return null
  }) as Record<keyof DevHubAnalyticsCustomDimensions, string | null>
}

export const analytics: Analytics = {
  setUser(userId) {
    if (__DEV__) log('set', { user_id: userId })
    tracker.setUser(userId || '')
    firebase.analytics().setUserId(userId || '')
    firebase.analytics().setUserProperty('user_id', userId || '')
  },

  setDimensions(dimensions) {
    if (__DEV__) log('set', dimensions)
    _dimensions = { ..._dimensions, ...dimensions }

    firebase.analytics().setUserProperties(getFormatedDimensions())
  },

  trackEvent(category, action, label, value, payload = {}) {
    // TODO: Test this and fix
    const customDimensions = _.isPlainObject(payload)
      ? payload
      : typeof payload === 'string' || typeof payload === 'number'
      ? ({ payload } as any)
      : {}

    Object.assign(customDimensions, _dimensions)

    if (__DEV__) log('event', category, action)
    tracker.trackEvent(category, action, { label, value }, { customDimensions })
    firebase.analytics().logEvent(action.replace(/\//g, '_'), {
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
    if (__DEV__) log('screen_view', screenName)
    tracker.trackScreenView(screenName, {
      customDimensions: getFormatedDimensions(),
    })
    firebase.analytics().setCurrentScreen(screenName)
  },
}

analytics.setDimensions(_dimensions)
