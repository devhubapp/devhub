import * as firebase from 'react-native-firebase'
import {
  GoogleAnalyticsSettings,
  GoogleAnalyticsTracker,
} from 'react-native-google-analytics-bridge'

import { appVersion } from '../../components/common/AppVersion'
import { Analytics } from './'

GoogleAnalyticsSettings.setDryRun(false)
GoogleAnalyticsSettings.setDispatchInterval(5)

const tracker = new GoogleAnalyticsTracker('UA-52350759-2')
tracker.setAppName('devhub-app')
tracker.setAppVersion(appVersion)

const log = (...args: any[]) => {
  console.log('[ANALYTICS]', ...args) // tslint:disable-line no-console
}

export const analytics: Analytics = {
  setUser(userId) {
    if (__DEV__) log('set', { user_id: userId })
    tracker.setUser(userId)
    firebase.analytics().setUserId(userId)
  },

  trackEvent(category, action) {
    if (__DEV__) log('event', category, action)
    tracker.trackEvent(category, action)
    firebase.analytics().logEvent(action, { category })
  },

  trackModalView(modalName) {
    this.trackScreenView(`${modalName}_MODAL`)
  },

  trackScreenView(screenName) {
    if (__DEV__) log('screen_view', screenName)
    tracker.trackScreenView(screenName)
    firebase.analytics().setCurrentScreen(screenName)
  },
}
