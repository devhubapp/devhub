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
  },

  trackEvent(category, action) {
    if (__DEV__) log('event', category, action)
    tracker.trackEvent(category, action)
  },

  trackException(description, isFatal) {
    if (__DEV__) log('event exception', description, isFatal)
    tracker.trackException(description, isFatal)
  },

  trackModalView(modalName) {
    this.trackScreenView(`${modalName}_MODAL`)
    tracker.trackEvent('open_modal', modalName)
  },

  trackScreenView(screenName) {
    if (__DEV__) log('screen_view', screenName)
    tracker.trackScreenView(screenName)
  },
}
