import React, { PureComponent, StrictMode } from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

import { AppNavigator } from '../navigation/AppNavigator'
import { configureStore } from '../redux/store'
import { AppGlobalStyles } from './AppGlobalStyles'
import { DimensionsProvider } from './context/DimensionsContext'
import { ThemeProvider } from './context/ThemeContext'

const { persistor, store } = configureStore()

// TODO: Enable StrictMode after react-native fixes it
// @see https://github.com/facebook/react-native/issues/22186
export class App extends PureComponent {
  render() {
    return (
      // <StrictMode>
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
      // </StrictMode>
    )
  }
}
