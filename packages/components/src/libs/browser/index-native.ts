import { BrowserCrossPlatform } from '.'
import { Linking } from '../linking'

export const Browser: BrowserCrossPlatform = {
  addEventListener: (e: any, handler: any) => {
    if (e === 'url') return Linking.addEventListener(e, handler)
    console.debug('[BROWSER] Ignoring addEventListener event', e) // tslint:disable-line no-console
  },
  removeEventListener: (e: any, handler: any) => {
    if (e === 'url') return Linking.removeEventListener(e, handler)
    console.debug('[BROWSER] Ignoring removeEventListener event', e) // tslint:disable-line no-console
  },
  dismiss: () => undefined,
  openURL: Linking.openURL,
}
;(Browser as any)._validateURL = (Linking as any)._validateURL
