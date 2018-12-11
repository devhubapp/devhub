import React from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

import '../libs/analytics'
import { AppNavigator } from '../navigation/AppNavigator'
import { ReduxStoreProvider } from '../redux/context/ReduxStoreContext'
import { configureStore } from '../redux/store'
import { AppGlobalStyles } from './AppGlobalStyles'
import { ColumnWidthProvider } from './context/ColumnWidthContext'
import { DimensionsProvider } from './context/DimensionsContext'
import { AppLayoutProvider } from './context/LayoutContext'
import { ThemeProvider } from './context/ThemeContext'

const { persistor, store } = configureStore()

// TODO: Enable StrictMode after react-native fixes it
// @see https://github.com/facebook/react-native/issues/22186
export function App() {
  return (
    // <StrictMode>
    <ReduxProvider store={store}>
      <ReduxStoreProvider>
        <PersistGate loading={null} persistor={persistor}>
          <DimensionsProvider>
            <AppLayoutProvider>
              <ColumnWidthProvider>
                <ThemeProvider>
                  <>
                    <AppGlobalStyles />
                    <AppNavigator />
                  </>
                </ThemeProvider>
              </ColumnWidthProvider>
            </AppLayoutProvider>
          </DimensionsProvider>
        </PersistGate>
      </ReduxStoreProvider>
    </ReduxProvider>
    // </StrictMode>
  )
}
