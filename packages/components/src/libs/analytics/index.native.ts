import * as firebase from 'react-native-firebase'

import { Analytics } from './'

const log = (...args: any[]) => {
  console.log('[ANALYTICS]', ...args) // tslint:disable-line no-console
}

export const analytics: Analytics = {
  setUser(userId) {
    if (__DEV__) log('set', { user_id: userId })
    firebase.analytics().setUserId(userId)
  },

  trackEvent(category, action) {
    if (__DEV__) log('event', category, action)
    firebase.analytics().logEvent(action, { category })
  },

  trackModalView(modalName) {
    this.trackScreenView(`${modalName}_MODAL`)
  },

  trackScreenView(screenName) {
    if (__DEV__) log('screen_view', screenName)
    firebase.analytics().setCurrentScreen(screenName)
  },
}
