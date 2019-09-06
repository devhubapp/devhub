import _ from 'lodash'
import { InteractionManager } from 'react-native'
import * as firebase from 'react-native-firebase'

import { constants } from '@devhub/core'
import { Platform } from '../platform'
import { Analytics, DevHubAnalyticsCustomDimensions } from './'
import { formatDimensions } from './helpers'

firebase.analytics().setAnalyticsCollectionEnabled(true) // !__DEV__

let _dimensions: DevHubAnalyticsCustomDimensions = {
  is_beta: constants.IS_BETA,
  is_dev: __DEV__,
  is_electron: Platform.isElectron,
}

function log(..._args: any[]) {
  // console.log('[ANALYTICS]', ...args) // tslint:disable-line no-console
}

export const analytics: Analytics = {
  setUser(userId) {
    if (__DEV__) log('set', { user_id: userId })
    firebase.analytics().setUserId(userId || '')
  },

  setDimensions(dimensions) {
    if (__DEV__) log('set', dimensions)
    _dimensions = { ..._dimensions, ...dimensions }

    firebase.analytics().setUserProperties(formatDimensions(_dimensions))
  },

  trackEvent(category, action, label, value, payload = {}) {
    InteractionManager.runAfterInteractions(() => {
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
