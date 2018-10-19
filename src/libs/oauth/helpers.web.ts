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
      data?: OAuthResponseData & { error?: boolean }
    }) => {
      if (!(e && e.data)) {
        reject('Invalid response')
        finished = true
        return
      }

      const { access_token: accessToken, error } = e.data

      window.removeEventListener('message', handleMessage)

      if (accessToken && !error) resolve(e.data)
      else reject(error)

      finished = true
    }

    window.addEventListener('message', handleMessage, false)
    setTimeout(() => {
      if (!finished) {
        reject('Timeout')
        window.removeEventListener('message', handleMessage)
        finished = true
      }
    }, 120 * 1000)

    if (popup) {
      popup.onbeforeunload = () => {
        if (!finished) {
          window.removeEventListener('message', handleMessage)
          reject('Canceled')
          finished = true
        }
      }
    }
  })
}
