import { constants } from '@devhub/core'
import { EventEmitter } from 'fbemitter'
import InAppBrowserReborn from 'react-native-inappbrowser-reborn'

import { BrowserCrossPlatform } from '.'
import { bugsnag } from '../bugsnag'
import { Linking } from '../linking'

const emitter = new EventEmitter()
let backgroundColor: string
let foregroundColor: string

export const Browser: BrowserCrossPlatform = {
  addListener: (e: any, handler: any) => {
    if (e === 'url') {
      Linking.addEventListener(e, handler)
      return { remove: () => Linking.removeEventListener(e, handler) }
    }

    if (e === 'onShow' || e === 'onDismiss') {
      return emitter.addListener(e, handler)
    }

    console.debug('[BROWSER] Unknown addListener event', e) // eslint-disable-line no-console
    return null
  },
  dismiss: InAppBrowserReborn.close,
  openURL: async (url, options) => {
    try {
      const isAvailable = await InAppBrowserReborn.isAvailable()
      if (!isAvailable) throw new Error('InAppBrowser not available.')

      emitter.emit('onShow')
      await InAppBrowserReborn.open(url, {
        modalEnabled: false,
        preferredBarTintColor: backgroundColor,
        preferredControlTintColor: foregroundColor,
        secondaryToolbarColor: foregroundColor,
        toolbarColor: backgroundColor,
        ...(options && options.native),
      })

      emitter.emit('onDismiss')
    } catch (error) {
      const description = 'InAppBrowser failed to open url.'
      bugsnag.notify(error, { description })
      console.error(description, error, {
        url,
        backgroundColor,
        foregroundColor,
      })
      return Linking.openURL(url)
    }
  },
  openURLOnNewTab: (...args) => {
    void Browser.openURL(...args)
  },
  setBackgroundColor: (color) => {
    backgroundColor = color
  },
  setForegroundColor: (color) => {
    foregroundColor = color
  },
}

Linking.addEventListener('url', ({ url }) => {
  if (url && url.startsWith(`${constants.APP_DEEP_LINK_SCHEMA}://`)) {
    InAppBrowserReborn.close()
  }
})
