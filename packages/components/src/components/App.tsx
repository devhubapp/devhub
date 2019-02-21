import React from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

import '../libs/analytics'

import { HelmetProvider } from '../libs/helmet'
import { AppNavigator } from '../navigation/AppNavigator'
import { enableNetworkInterceptors } from '../network-interceptor'
import { ReduxStoreProvider } from '../redux/context/ReduxStoreContext'
import { configureStore } from '../redux/store'
import { AppGlobalStyles } from './AppGlobalStyles'
import { ColumnFocusProvider } from './context/ColumnFocusContext'
import { ColumnWidthProvider } from './context/ColumnWidthContext'
import { DimensionsProvider } from './context/DimensionsContext'
import { AppLayoutProvider } from './context/LayoutContext'
import { SpringAnimatedThemeProvider } from './context/SpringAnimatedThemeContext'

enableNetworkInterceptors()

const { persistor, store } = configureStore()

// TODO: Enable StrictMode after react-native fixes it
// @see https://github.com/facebook/react-native/issues/22186
export function App() {
  return (
    // <StrictMode>
    <HelmetProvider>
      <ReduxProvider store={store}>
        <ReduxStoreProvider>
          <PersistGate loading={null} persistor={persistor}>
            <DimensionsProvider>
              <AppLayoutProvider>
                <ColumnFocusProvider>
                  <ColumnWidthProvider>
                    <SpringAnimatedThemeProvider>
                      <>
                        <AppGlobalStyles />
                        <AppNavigator />
                      </>
                    </SpringAnimatedThemeProvider>
                  </ColumnWidthProvider>
                </ColumnFocusProvider>
              </AppLayoutProvider>
            </DimensionsProvider>
          </PersistGate>
        </ReduxStoreProvider>
      </ReduxProvider>
    </HelmetProvider>
    // </StrictMode>
  )
}
