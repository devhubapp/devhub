import { BrowserCrossPlatform } from '.'
import { Linking } from '../linking'

export const Browser: BrowserCrossPlatform = {
  addListener: (e: any, handler: any) => {
    if (e === 'url') {
      Linking.addEventListener(e, handler)
      return { remove: () => Linking.removeEventListener(e, handler) }
    }

    console.debug('[BROWSER] Ignoring addEventListener event', e) // tslint:disable-line no-console
    return null
  },
  dismiss: () => undefined,
  openURL: Linking.openURL,
  openURLOnNewTab: url => {
    window.open(url, '_blank')
  },
  setBackgroundColor: () => undefined,
  setForegroundColor: () => undefined,
}
;(Browser as any)._validateURL = (Linking as any)._validateURL
