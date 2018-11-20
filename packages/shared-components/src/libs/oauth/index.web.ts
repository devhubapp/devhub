import qs from 'qs'

import { SERVER_BASE_URL } from 'shared-core/dist/utils/constants'
import { listenForNextMessageData } from './helpers.web'

const callbackURL = ''

function popupWindow(url: string, w: number = 500, h: number = 600) {
  const left = (window.screen.width - w) / 2
  const top = (window.screen.height - h) / 2

  return window.open(
    url,
    '_blank',
    `resizable=yes, width=${w}, height=${h}, top=${top}, left=${left}`,
  )
}

export async function executeOAuth(scopes: string[]) {
  const scopesStr = (scopes || []).join(' ')
  const querystring = qs.stringify({
    scope: scopesStr,
    callback_url: callbackURL,
    origin: window.location.origin || window.location.href,
  })

  // console.log('[OAUTH] Opening popup...')
  const serverBaseUrl =
    window.location.hostname === 'localhost' ? SERVER_BASE_URL : ''
  const popup = popupWindow(`${serverBaseUrl}/auth/github?${querystring}`)

  try {
    const data = await listenForNextMessageData(popup)
    // console.log('[OAUTH] Received data:', data)

    if (!(data && data.access_token)) {
      throw new Error('Login failed: No access token received.')
    }

    return data
  } catch (e) {
    if (popup) popup.close()
    throw e
  }
}
