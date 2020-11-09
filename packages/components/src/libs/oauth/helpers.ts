import qs from 'qs'

import { OAuthResponseData } from '@devhub/core'
import { Browser } from '../browser'
import { Linking } from '../linking'
import { Platform } from '../platform'

export const getUrlParamsIfMatches = (
  url: string,
  prefix: string,
): OAuthResponseData | null => {
  if (!url || typeof url !== 'string') return null

  if (url.startsWith(prefix)) {
    const query = url.replace(new RegExp(`^${prefix}[?]?`), '')
    const params = (qs.parse(query) || {}) as Omit<
      OAuthResponseData,
      'github_scope' | 'oauth'
    > & {
      github_scope?: string
      oauth?: string | boolean
    }

    return {
      ...params,
      github_scope: (params.github_scope || '')
        .replace(/,/g, ' ')
        .split(' ')
        .filter(Boolean)
        .map((scope: string) => `${scope || ''}`.trim())
        .filter(Boolean),
      oauth: params.oauth === true || params.oauth === 'true',
    }
  }

  return null
}

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

    Linking.addEventListener('url', handleUrl)

    if (Platform.OS !== 'web') {
      const onDismissListener = Browser.addListener('onDismiss', () => {
        setTimeout(() => {
          // console.log('[OAUTH] Closed')
          if (finished) return

          finished = true
          Linking.removeEventListener('url', handleUrl)
          if (onDismissListener) {
            onDismissListener.remove()
          }
          reject(new Error('Canceled'))
        }, 500)
      })
    }
  })
}

export const listenForNextMessageData = (
  popup?: ReturnType<typeof window.open>,
) => {
  let finished = false

  return new Promise<OAuthResponseData>((resolve, reject) => {
    const handleMessage = (e?: {
      data?: OAuthResponseData & { error?: boolean | string; oauth: boolean }
    }) => {
      // console.log('[OAUTH] Message received', e)
      // Can be messages from other places, e.g. from the redux devtools
      if (
        !(
          e &&
          e.data &&
          (e.data.oauth ||
            e.data.app_token ||
            e.data.github_token ||
            e.data.error)
        )
      ) {
        return
      }

      const { app_token: appToken, github_token: githubToken, error } = e.data

      window.removeEventListener('message', handleMessage)

      if (appToken && githubToken && !error) resolve(e.data)
      else
        reject(
          new Error(typeof error === 'string' ? error : 'No token received'),
        )

      finished = true
    }

    window.addEventListener('message', handleMessage, false)
    setTimeout(() => {
      if (finished) return

      finished = true
      window.removeEventListener('message', handleMessage)
      reject(new Error('Timeout'))
    }, 120 * 1000)

    if (popup) {
      const onClosePopup = () => {
        // the close may be detected before the postMessage
        if (!(popup.closed && !finished)) return

        // console.log('[OAUTH] Popup closed.')
        finished = true
        window.removeEventListener('message', handleMessage)
        reject(new Error('Canceled'))
      }

      // reliable cross-browser way to check if popup was closed
      const timer = setInterval(() => {
        if (popup.closed) {
          onClosePopup()
          clearInterval(timer)
        } else if (finished) {
          clearInterval(timer)
        }
      }, 500)
    }
  })
}
