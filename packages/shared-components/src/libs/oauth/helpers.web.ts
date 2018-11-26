import { OAuthResponseData } from './helpers'

export * from './helpers.shared'

export const listenForNextUrl = () => {
  throw new Error('Not implemented on this platform.')
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
          (e.data.oauth || (e.data.access_token || e.data.error))
        )
      ) {
        return
      }

      const { access_token: accessToken, error } = e.data

      window.removeEventListener('message', handleMessage)

      if (accessToken && !error) resolve(e.data)
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
      const onClosePopup = async () => {
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
