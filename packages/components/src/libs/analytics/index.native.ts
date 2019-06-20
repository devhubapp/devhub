import _ from 'lodash'
import * as firebase from 'react-native-firebase'

import { constants } from '@devhub/core'
import { Platform } from '../platform'
import { Analytics, DevHubAnalyticsCustomDimensions } from './'

firebase.analytics().setAnalyticsCollectionEnabled(true) // !__DEV__

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
    firebase.analytics().setUserId(userId || '')
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
    firebase.analytics().setCurrentScreen(screenName)
  },
}

analytics.setDimensions(_dimensions)
