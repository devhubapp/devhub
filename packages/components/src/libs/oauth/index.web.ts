import qs from 'qs'

import { constants } from '@devhub/core'
import { Linking } from '../linking'
import { Platform } from '../platform/index.web'
import {
  getUrlParamsIfMatches,
  listenForNextMessageData,
  listenForNextUrl,
  OAuthResponseData,
} from './helpers'

const redirectUri = 'devhub://oauth/github'

const popupTarget =
  !__DEV__ &&
  (Platform.realOS !== 'web' ||
    Platform.isStandalone ||
    (navigator.userAgent || '').includes('Edge'))
    ? '_self'
    : '_blank'

function popupWindow(url: string, w: number = 500, h: number = 600) {
  const left = (window.screen.width - w) / 2
  const top = (window.screen.height - h) / 2

  return window.open(
    url,
    popupTarget,
    `resizable=yes, width=${w}, height=${h}, top=${top}, left=${left}`,
  )
}

export async function executeOAuth(scope: string[]) {
  const scopeStr = (scope || []).join(' ')
  const querystring = qs.stringify({
    scope: scopeStr,
    redirect_uri: Platform.isElectron ? redirectUri : '',
  })

  // console.log('[OAUTH] Opening popup...')
  const popup = popupWindow(
    `${constants.API_BASE_URL}/oauth/github?${querystring}`,
  )

  try {
    let params: OAuthResponseData | null

    if (Platform.isElectron && (await Linking.canOpenURL(redirectUri))) {
      const url = await listenForNextUrl()
      // console.log('[OAUTH] Received URL:', url)

      params = getUrlParamsIfMatches(url, redirectUri)
      // console.log('[OAUTH] URL params:', params)
    } else {
      params = await listenForNextMessageData(popup)
      // console.log('[OAUTH] Received data:', params)
    }

    if (!(params && params.app_token && params.github_token)) {
      throw new Error('Login failed: No access token received.')
    }

    return params
  } catch (e) {
    if (popup && popup !== window) popup.close()

    throw e
  }
}
