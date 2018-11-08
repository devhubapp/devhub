import React, { PureComponent, StrictMode } from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

import { bugsnagClient, initBugsnag } from '../libs/bugsnag'
import { AppNavigator } from '../navigation/AppNavigator'
import { configureStore } from '../redux/store'
import { AppGlobalStyles } from './AppGlobalStyles'
import { DimensionsProvider } from './context/DimensionsContext'
import { ThemeProvider } from './context/ThemeContext'

const { persistor, store } = configureStore()

initBugsnag('231f337f6090422c611017d3dab3d32e')
bugsnagClient.config.notifyReleaseStages = ['production']

// TODO: Enable StrictMode after react-redux fixes it
// @see https://github.com/reduxjs/react-redux/issues/897
// @see https://github.com/reduxjs/react-redux/issues/890
// @see https://github.com/reduxjs/react-redux/issues/950
export class App extends PureComponent {
  render() {
    return (
      <StrictMode>
        <ReduxProvider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <DimensionsProvider>
              <ThemeProvider>
                <>
                  <AppGlobalStyles />
                  <AppNavigator />
                </>
              </ThemeProvider>
            </DimensionsProvider>
          </PersistGate>
        </ReduxProvider>
      </StrictMode>
    )
  }
}
