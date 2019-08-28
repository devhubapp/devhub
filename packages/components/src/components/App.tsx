import React, { StrictMode } from 'react'

import '../libs/analytics'

import { AppNavigator } from '../navigation/AppNavigator'
import { enableNetworkInterceptors } from '../network-interceptor'
import { AppGlobalStyles } from './AppGlobalStyles'
import { AppProviders } from './AppProviders'
import { AppIconBadge } from './common/AppIconBadge'
import { UnreadCountProvider } from './context/UnreadCountContext'

enableNetworkInterceptors()

// TODO: Fix StrictMode warnings
// @see https://github.com/facebook/react-native/issues/22186
export function App() {
  return (
    <StrictMode>
      <AppProviders>
        <AppGlobalStyles key="app-global-styles" />
        <AppNavigator key="app-navigator" />

        <UnreadCountProvider>
          <AppIconBadge />
        </UnreadCountProvider>
      </AppProviders>
    </StrictMode>
  )
}
