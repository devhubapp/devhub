// Source: https://github.com/PaulLeCam/react-native-electron/blob/master/src/apis/Linking.js

import { LinkingCrossPlatform } from './index'
import { Linking as LinkingNative } from './index-native'

const eventHandlers = new Map()

export const Linking: LinkingCrossPlatform = {
  addEventListener: (type: string, handler: any) => {
    if (!(type === 'url' && typeof handler === 'function')) return

    const wrapHandler = (_e: any, url: string) => {
      if (typeof (url || '') !== 'string') {
        if (__DEV__) console.error('[Linking] URL not a string', url)
        return
      }

      handler({ type, url: url || '' })
    }

    eventHandlers.set(handler, wrapHandler)
    window.ipc.addListener('open-url', wrapHandler)
  },
  async canOpenURL(url: string) {
    return await window.ipc.sendSync('can-open-url', url)
  },
  clearCurrentURL() {
    //
  },
  getCurrentURL() {
    return typeof window.location.href === 'string'
      ? window.location.href || ''
      : ''
  },
  getInitialURL() {
    return LinkingNative.getInitialURL()
  },
  openURL: (url: string): Promise<void> => {
    return LinkingNative.openURL(url)
  },
  removeEventListener: (type: string, handler: any) => {
    if (!(type === 'url' && typeof handler === 'function')) return

    const wrapHandler = eventHandlers.get(handler)
    if (wrapHandler) {
      window.ipc.removeListener('open-url', wrapHandler)
    }

    eventHandlers.delete(handler)
  },
}
