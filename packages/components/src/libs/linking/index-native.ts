import { Linking as LinkingOriginal } from 'react-native'

import { Platform } from '../platform'
import { LinkingCrossPlatform } from './index'

let currentURL: string = ''
let initialURL: string = ''

LinkingOriginal.getInitialURL().then(url => {
  initialURL = url || ''
})

LinkingOriginal.addEventListener('url', e => {
  currentURL = e.url || ''
})

export const Linking: LinkingCrossPlatform = {
  addEventListener: LinkingOriginal.addEventListener.bind(LinkingOriginal),
  canOpenURL: LinkingOriginal.canOpenURL.bind(LinkingOriginal),
  getCurrentURL:
    Platform.OS === 'web' ? () => window.location.href || '' : () => currentURL,
  getInitialURL: () => initialURL,
  openURL: LinkingOriginal.openURL.bind(LinkingOriginal),
  removeEventListener: LinkingOriginal.removeEventListener.bind(
    LinkingOriginal,
  ),
}
