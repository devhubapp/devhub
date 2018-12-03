import { Linking } from 'react-native'

import { Browser } from '../browser'
import { Platform } from '../platform'

export * from './helpers.shared'

export const listenForNextUrl = () => {
  let finished = false

  return new Promise<string>((resolve, reject) => {
    const handleUrl = (e: { url: string }) => {
      // console.log('[OAUTH] URL change detected', e)
      Linking.removeEventListener('url', handleUrl)

      finished = true

      const url = (e && e.url) || ''
      return url ? resolve(url) : reject(new Error('No URL received'))
    }

    const handleClose = () => {
      // console.log('[OAUTH] Closed')
      if (finished) return

      finished = true
      Linking.removeEventListener('url', handleUrl)
      if (Platform.OS === 'ios') {
        Browser.removeEventListener('onDismiss', handleClose)
      }
      reject(new Error('Canceled'))
    }

    Linking.addEventListener('url', handleUrl)
    if (Platform.OS === 'ios') {
      Browser.addEventListener('onDismiss', handleClose)
    }
    setTimeout(() => {
      if (finished) return

      finished = true
      Linking.removeEventListener('url', handleUrl)
      if (Platform.OS === 'ios') {
        Browser.removeEventListener('onDismiss', handleClose)
      }
      reject(new Error('Timeout'))
    }, 120 * 1000)
  })
}

export const listenForNextMessageData = () => {
  throw new Error('Not implemented on this platform.')
}
