import { Linking, StatusBar } from 'react-native'
import SafariView, { ISafaryOptions } from 'react-native-safari-view'

export default {
  ...Linking,
  ...SafariView,
  openURL: (url: string, options?: ISafaryOptions) => {
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
        console.error('Safari View failed to open url', error, {
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
