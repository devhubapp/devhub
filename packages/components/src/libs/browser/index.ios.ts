import SafariView from 'react-native-safari-view'

import { BrowserCrossPlatform } from '.'
import { bugsnag } from '../bugsnag'
import { Linking } from '../linking'

let backgroundColor: string
let foregroundColor: string

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
  openURL: url => {
    SafariView.isAvailable()
      .then(isAvailable => {
        if (!isAvailable) throw new Error('SafariView not available.')

        return SafariView.show({
          url,
          barTintColor: backgroundColor,
          tintColor: foregroundColor,
          fromBottom: false,
          readerMode: false,
        })
      })
      .catch(error => {
        const description = 'Safari View failed to open url'
        bugsnag.notify(error, { description })
        console.error(description, error, {
          url,
          backgroundColor,
          foregroundColor,
        })
        return Linking.openURL(url)
      })
  },
  setBackgroundColor: color => {
    backgroundColor = color
  },
  setForegroundColor: color => {
    foregroundColor = color
  },
}

Linking.addEventListener('url', ({ url }) => {
  if (!(url && url.startsWith('devhub://'))) return

  SafariView.dismiss()
})
