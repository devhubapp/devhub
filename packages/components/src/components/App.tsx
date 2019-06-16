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
import { ColumnFiltersProvider } from './context/ColumnFiltersContext'
import { ColumnFocusProvider } from './context/ColumnFocusContext'
import { ColumnWidthProvider } from './context/ColumnWidthContext'
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
            <AppLayoutProvider>
              <ColumnFocusProvider>
                <ColumnFiltersProvider>
                  <ColumnWidthProvider>
                    <SpringAnimatedThemeProvider>
                      <>
                        <AppGlobalStyles key="app-global-styles" />
                        <AppNavigator key="app-navigator" />
                      </>
                    </SpringAnimatedThemeProvider>
                  </ColumnWidthProvider>
                </ColumnFiltersProvider>
              </ColumnFocusProvider>
            </AppLayoutProvider>
          </PersistGate>
        </ReduxStoreProvider>
      </ReduxProvider>
    </HelmetProvider>
    // </StrictMode>
  )
}
