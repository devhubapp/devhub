import { appVersion } from '../../components/common/AppVersion'
import { Analytics } from './'

const trackingId = 'UA-52350759-2'
gtag('config', trackingId, { app_name: 'devhub-app' })

const gtagAndLog = (...args: any[]) => {
  if (__DEV__) console.debug('[ANALYTICS]', ...args) // tslint:disable-line no-console
  gtag(...args)
}

export const analytics: Analytics = {
  setUser(userId) {
    gtagAndLog('set', { user_id: userId })
  },

  trackEvent(category, action) {
    gtagAndLog('event', action, { event_category: category })
  },

  trackModalView(modalName) {
    this.trackScreenView(`${modalName}_MODAL`)
  },

  trackScreenView(screenName) {
    gtagAndLog('event', 'screen_view', {
      screen_name: screenName,
      app_version: appVersion,
    })
  },
}
