// Source: https://github.com/PaulLeCam/react-native-electron/blob/master/src/apis/Linking.js

import _ from 'lodash'

const { remote, shell } = window.require('electron')

import { LinkingCrossPlatform } from './index'

const eventHandlers = new Map()

export const Linking: LinkingCrossPlatform = {
  addEventListener: (type: string, handler: any) => {
    if (!(type === 'url' && typeof handler === 'function')) return

    const wrapHandler = (_event: object, url: string) => {
      handler({ type, url })
    }

    eventHandlers.set(handler, wrapHandler)
    remote.app.on('open-url', wrapHandler)
  },
  async canOpenURL() {
    return true
  },
  async getInitialURL() {
    return remote.process.argv[1] || null
  },
  openURL: (url: string, options?: object): Promise<void> => {
    return shell.openExternal(url, options)
      ? Promise.resolve()
      : Promise.reject(new Error('Could not open URL'))
  },
  removeEventListener: (type: string, handler: any) => {
    if (!(type === 'url' && typeof handler === 'function')) return

    const wrapHandler = eventHandlers.get(handler)
    if (wrapHandler) {
      remote.app.removeListener('open-url', wrapHandler)
    }

    eventHandlers.delete(handler)
  },
}
