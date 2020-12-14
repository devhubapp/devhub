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
import { PlansProvider } from './context/PlansContext'
import { ThemeProvider } from './context/ThemeContext'
import { Compose } from './common/Compose'

const { persistor, store } = configureStore()

export interface AppProvidersProps {
  children: React.ReactNode
}

export function AppProviders(props: AppProvidersProps) {
  return (
    <Compose
      components={[
        (child) => <HelmetProvider children={child} />,
        (child) => <ReduxProvider children={child} store={store} />,
        (child) => (
          <PersistGate children={child} loading={null} persistor={persistor} />
        ),
        (child) => <AppearanceProvider children={child} />,
        (child) => <ThemeProvider children={child} />,
        (child) => <SafeAreaProvider children={child} />,
        (child) => <DialogProvider children={child} />,
        (child) => <DeepLinkProvider children={child} />,
        (child) => <PlansProvider children={child} />,
        (child) => <AppLayoutProvider children={child} />,
        (child) => <ColumnFocusProvider children={child} />,
        (child) => <ColumnWidthProvider children={child} />,
        (child) => <ColumnFiltersProvider children={child} />,
        (child) => <LoginHelpersProvider children={child} />,
      ]}
    >
      <>
        {props.children}
        <OverrideSystemDialog />
      </>
    </Compose>
  )
}
