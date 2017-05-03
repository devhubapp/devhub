import React, { Component } from 'react'
import { Platform } from 'react-native'
import { Provider } from 'react-redux'

import './utils/services'
import AppContainer from './containers/AppContainer'
import store from './store'
import DeepLinkWatcher from './navigators/DeepLinkWatcher'

// disable console log on production
if (!__DEV__ && console && Platform.OS !== 'web') {
  /* eslint-disable no-console */
  console.log = () => {}
  console.debug = () => {}
  /* eslint-enable */
}

// ps: codepush needs this to be a class instead of a stateless function
// eslint-disable-next-line react/prefer-stateless-function
export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <DeepLinkWatcher>
          <AppContainer {...this.props} />
        </DeepLinkWatcher>
      </Provider>
    )
  }
}
