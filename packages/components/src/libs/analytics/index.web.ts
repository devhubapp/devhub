import { appVersion } from '../../components/common/AppVersion'
import { Platform } from '../platform'
import { Analytics } from './'

const trackingId = 'UA-52350759-2'
gtag('config', trackingId, {
  app_version: appVersion,
  app_name: __DEV__ ? 'devhub-dev' : 'devhub',
  custom_map: { dimension1: 'user_id', dimension2: 'is_electron' },
})

if (__DEV__) {
  ;(window as any)[`ga-disable-${trackingId}`] = true
}

const gtagAndLog = (...args: any[]) => {
  // if (__DEV__) console.debug('[ANALYTICS]', ...args) // tslint:disable-line no-console
  gtag(...args)
}

gtagAndLog('set', { is_electron: Platform.isElectron })

export const analytics: Analytics = {
  setUser(userId) {
    gtagAndLog('set', { user_id: userId })
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
