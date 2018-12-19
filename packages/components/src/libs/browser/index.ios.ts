import { Linking, StatusBar } from 'react-native'
import SafariView, { SafaryOptions } from 'react-native-safari-view'
import { bugsnag } from '../bugsnag'

export const Browser = {
  ...Linking,
  ...SafariView,
  openURL: (url: string, options?: SafaryOptions) => {
    SafariView.isAvailable()
      .then(isAvailable => {
        if (!isAvailable) throw new Error('SafariView not available.')

        return SafariView.show({
          url,
          tintColor: '#000000',
          ...options,
        })
      })
      .catch(error => {
        const description = 'Safari View failed to open url'
        bugsnag.notify(error, { description })
        console.error(description, error, {
          url,
          ...options,
        })
        return Linking.openURL(url)
      })
  },
}

SafariView.addEventListener('onShow', () => {
  StatusBar.setHidden(true, 'none')
})

SafariView.addEventListener('onDismiss', () => {
  StatusBar.setHidden(false, 'fade')
})
