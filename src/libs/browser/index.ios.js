/* @flow */

import SafariView from 'react-native-safari-view'
import { Linking, StatusBar } from 'react-native'

type SafariOptions = {
  // A Boolean indicating to use Safari's Reader Mode if available
  readerMode?: boolean,

  // A String containing a hex, rgba or rgba color to use for the browser controls
  tintColor?: string,

  // A String containing a hex, rgba or rgba color
  // to use for the background of the browser controls
  // (only available on iOS 10 and higher)
  barTintColor?: string,

  // A Boolean indicating to open the Safari View from the bottom
  fromBottom?: boolean,
}

export default {
  ...Linking,
  ...SafariView,
  openURL: (url: string, options: SafariOptions = {}) => {
    SafariView.isAvailable()
      .then(isAvailable => {
        if (isAvailable === false) throw new Error('SafariView not available.')

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
  StatusBar.setHidden(true, false)
})

SafariView.addEventListener('onDismiss', () => {
  StatusBar.setHidden(false, true)
})
