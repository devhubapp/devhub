import { constants } from '@devhub/core'
import { Linking as LinkingOriginal } from 'react-native'

import { emitter } from '../emitter'
import { Platform } from '../platform'
import { LinkingCrossPlatform } from './index'

let currentURL = ''
let initialURL = ''

void LinkingOriginal.getInitialURL().then((url) => {
  if (typeof (url || '') !== 'string') {
    if (__DEV__) console.error('[Linking.getInitialURL] URL not a string', url)
    return
  }

  initialURL = url || ''
})

LinkingOriginal.addEventListener('url', (e) => {
  if (!(e && typeof (e.url || '') === 'string')) {
    if (__DEV__)
      console.error('[Linking.addEventListener] e.url not a string', e.url)
    return
  }

  currentURL = e.url || ''
})

export const Linking: LinkingCrossPlatform = {
  addEventListener: LinkingOriginal.addEventListener.bind(LinkingOriginal),
  canOpenURL: async (url) => {
    if (url && url.startsWith(`${constants.APP_DEEP_LINK_SCHEMA}://`)) {
      return true
    }

    const canOpenURL = LinkingOriginal.canOpenURL.bind(LinkingOriginal)
    return canOpenURL(url)
  },
  clearCurrentURL: () => {
    currentURL = ''
  },
  getCurrentURL:
    Platform.OS === 'web' ? () => window.location.href || '' : () => currentURL,
  getInitialURL: () => initialURL,
  openURL: async (url) => {
    if (url && url.startsWith(`${constants.APP_DEEP_LINK_SCHEMA}://`)) {
      emitter.emit('DEEP_LINK', { url })
      return
    }

    const openURL = LinkingOriginal.openURL.bind(LinkingOriginal)
    return openURL(url)
  },
  removeEventListener:
    LinkingOriginal.removeEventListener.bind(LinkingOriginal),
}
