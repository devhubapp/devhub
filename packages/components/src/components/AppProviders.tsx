import React from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

import { AppearanceProvider } from '../libs/appearence'
import { HelmetProvider } from '../libs/helmet'
import { SafeAreaProvider } from '../libs/safe-area-view'
import { configureStore } from '../redux/store'
import { OverrideSystemDialog } from './common/OverrideSystemDialog'
import { ColumnFiltersProvider } from './context/ColumnFiltersContext'
import { ColumnFocusProvider } from './context/ColumnFocusContext'
import { ColumnWidthProvider } from './context/ColumnWidthContext'
import { DeepLinkProvider } from './context/DeepLinkContext'
import { DialogProvider } from './context/DialogContext'
import { LoginHelpersProvider } from './context/LoginHelpersContext'
import { AppLayoutProvider } from './context/LayoutContext'
// import { PlansProvider } from './context/PlansContext'
import { ThemeProvider } from './context/ThemeContext'

const { persistor, store } = configureStore()

export interface AppProvidersProps {
  children: React.ReactNode
}

export function AppProviders(props: AppProvidersProps) {
  return (
    <HelmetProvider>
      <ReduxProvider store={store as any}>
        <PersistGate loading={null} persistor={persistor}>
          <DialogProvider>
            <DeepLinkProvider>
              <LoginHelpersProvider>
                {/* <PlansProvider> */}
                <AppLayoutProvider>
                  <ColumnFocusProvider>
                    <ColumnWidthProvider>
                      <ColumnFiltersProvider>
                        <AppearanceProvider>
                          <ThemeProvider>
                            <SafeAreaProvider>
                              {props.children}
                              <OverrideSystemDialog />
                            </SafeAreaProvider>
                          </ThemeProvider>
                        </AppearanceProvider>
                      </ColumnFiltersProvider>
                    </ColumnWidthProvider>
                  </ColumnFocusProvider>
                </AppLayoutProvider>
                {/* </PlansProvider> */}
              </LoginHelpersProvider>
            </DeepLinkProvider>
          </DialogProvider>
        </PersistGate>
      </ReduxProvider>
    </HelmetProvider>
  )
}
