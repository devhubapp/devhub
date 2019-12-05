import { EventEmitter } from 'fbemitter'

import { AppState, AppStateStatus } from 'react-native'
import { BrowserCrossPlatform } from '.'
import { Linking } from '../linking'

const emitter = new EventEmitter()

export const Browser: BrowserCrossPlatform = {
  addListener: (e: any, handler: any) => {
    if (e === 'url') {
      Linking.addEventListener(e, handler)
      return { remove: () => Linking.removeEventListener(e, handler) }
    }

    if (e === 'onShow' || e === 'onDismiss') {
      return emitter.addListener(e, handler)
    }

    console.debug('[BROWSER] Unknown addListener event', e) // tslint:disable-line no-console
    return null
  },
  dismiss: () => undefined,
  openURL: async (url: string) => {
    emitter.emit('onShow')
    registerAppStateListenerOnce()
    return await Linking.openURL(url)
  },
  openURLOnNewTab: url => {
    emitter.emit('onShow')
    registerAppStateListenerOnce()
    return window.open(url, '_blank')
  },
  setBackgroundColor: () => undefined,
  setForegroundColor: () => undefined,
}
;(Browser as any)._validateURL = (Linking as any)._validateURL

function registerAppStateListenerOnce() {
  const appStateHandlerOnce = (appState: AppStateStatus) => {
    console.log('xxx appState', appState)
    if (appState === 'active') {
      AppState.removeEventListener('change', appStateHandlerOnce)
      emitter.emit('onDismiss')
    }
  }
  AppState.addEventListener('change', appStateHandlerOnce)
}
