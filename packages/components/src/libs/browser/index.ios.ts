import { StatusBar } from 'react-native'
import SafariView, { SafaryOptions } from 'react-native-safari-view'

import { BrowserCrossPlatform } from '.'
import { bugsnag } from '../bugsnag'
import { Linking } from '../linking'

export const Browser: BrowserCrossPlatform = {
  ...SafariView,
  addEventListener: (e: any, handler: any) => {
    if (e === 'url') return Linking.addEventListener(e, handler)
    if (e === 'onShow') return SafariView.addEventListener(e, handler)
    if (e === 'onDismiss') return SafariView.addEventListener(e, handler)
    console.debug('[BROWSER] Unknown addEventListener event', e) // tslint:disable-line no-console
  },
  removeEventListener: (e: any, handler: any) => {
    if (e === 'url') return Linking.removeEventListener(e, handler)
    if (e === 'onShow') return SafariView.removeEventListener(e, handler)
    if (e === 'onDismiss') return SafariView.removeEventListener(e, handler)
    console.debug('[BROWSER] Unknown removeEventListener event', e) // tslint:disable-line no-console
  },
  dismiss: SafariView.dismiss,
  openURL: (url: string, options?: SafaryOptions) => {
    SafariView.isAvailable()
      .then(isAvailable => {
        if (!isAvailable) throw new Error('SafariView not available.')

        return SafariView.show({
          url,
          tintColor: '#000000',
          ...options,
        })
      })
      .catch(error => {
        const description = 'Safari View failed to open url'
        bugsnag.notify(error, { description })
        console.error(description, error, {
          url,
          ...options,
        })
        return Linking.openURL(url)
      })
  },
}

SafariView.addEventListener('onShow', () => {
  StatusBar.setHidden(true, 'none')
})

SafariView.addEventListener('onDismiss', () => {
  StatusBar.setHidden(false, 'fade')
})
