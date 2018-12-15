import qs from 'qs'

import { constants } from '@devhub/core'
import { Platform } from '../platform/index.web'
import { listenForNextMessageData } from './helpers.web'

const popupTarget =
  Platform.realOS !== 'web' ||
  Platform.isStandalone ||
  (navigator.userAgent || '').includes('Edge')
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
    redirect_uri: '',
  })

  // console.log('[OAUTH] Opening popup...')
  const popup = popupWindow(
    `${constants.API_BASE_URL}/oauth/github?${querystring}`,
  )

  try {
    const data = await listenForNextMessageData(popup)
    // console.log('[OAUTH] Received data:', data)

    if (!(data && data.app_token && data.github_token)) {
      throw new Error('Login failed: No access token received.')
    }

    return data
  } catch (e) {
    if (popup && popup !== window) popup.close()

    throw e
  }
}
