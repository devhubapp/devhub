import _ from 'lodash'
import * as firebase from 'react-native-firebase'
import {
  GoogleAnalyticsSettings,
  GoogleAnalyticsTracker,
} from 'react-native-google-analytics-bridge'

import { appVersion } from '../../components/common/AppVersion'
import { Analytics } from './'

GoogleAnalyticsSettings.setDryRun(__DEV__) // __DEV__
GoogleAnalyticsSettings.setDispatchInterval(5)
firebase.analytics().setAnalyticsCollectionEnabled(__DEV__) // __DEV__

const tracker = new GoogleAnalyticsTracker('UA-52350759-2')
tracker.setAppName(__DEV__ ? 'devhub-dev' : 'devhub')
tracker.setAppVersion(appVersion)
tracker.customDimensionsFieldsIndexMap = {
  user_id: 1,
  is_electron: 2,
}

const log = (...args: any[]) => {
  // console.log('[ANALYTICS]', ...args) // tslint:disable-line no-console
}

let _userId: string
export const analytics: Analytics = {
  setUser(userId) {
    _userId = userId

    if (__DEV__) log('set', { user_id: userId })
    tracker.setUser(userId)
    firebase.analytics().setUserId(userId)
  },

  trackEvent(category, action, label, value, payload = {}) {
    // TODO: Test this and fix
    const customDimensions = _.isPlainObject(payload)
      ? payload
      : typeof payload === 'string' || typeof payload === 'number'
      ? ({ payload } as any)
      : {}

    customDimensions.user_id = _userId
    customDimensions.is_electron = false

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
      customDimensions: { user_id: _userId, is_electron: false },
    })
    firebase.analytics().setCurrentScreen(screenName)
  },
}
