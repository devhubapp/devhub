import React, { PureComponent } from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

import { AppNavigator } from '../navigation/AppNavigator'
import { ReduxStoreProvider } from '../redux/context/ReduxStoreContext'
import { configureStore } from '../redux/store'
import { AppGlobalStyles } from './AppGlobalStyles'
import { ColumnSizeProvider } from './context/ColumnSizeContext'
import { DimensionsProvider } from './context/DimensionsContext'
import { LayoutProvider } from './context/LayoutContext'
import { ThemeProvider } from './context/ThemeContext'

const { persistor, store } = configureStore()

// TODO: Enable StrictMode after react-native fixes it
// @see https://github.com/facebook/react-native/issues/22186
export class App extends PureComponent {
  render() {
    return (
      // <StrictMode>
      <ReduxProvider store={store}>
        <ReduxStoreProvider>
          <PersistGate loading={null} persistor={persistor}>
            <DimensionsProvider>
              <LayoutProvider>
                <ColumnSizeProvider>
                  <ThemeProvider>
                    <>
                      <AppGlobalStyles />
                      <AppNavigator />
                    </>
                  </ThemeProvider>
                </ColumnSizeProvider>
              </LayoutProvider>
            </DimensionsProvider>
          </PersistGate>
        </ReduxStoreProvider>
      </ReduxProvider>
      // </StrictMode>
    )
  }
}
