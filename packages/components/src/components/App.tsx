import { setAutoFreeze } from 'immer'
import React, { Fragment } from 'react'

import '../libs/analytics'

import { ErrorBoundary } from '../libs/bugsnag'
import { AppNavigator } from '../navigation/AppNavigator'
import { enableNetworkInterceptors } from '../network-interceptor'
import { AppGlobalStyles } from './AppGlobalStyles'
import { AppProviders } from './AppProviders'
import { AppIconBadge } from './common/AppIconBadge'
import { UnreadCountProvider } from './context/UnreadCountContext'

enableNetworkInterceptors()

// workaround to memoize-state/proxyequal proxy bug
// @see https://github.com/theKashey/proxyequal/issues/25
setAutoFreeze(false)

// TODO: Enable StrictMode after react-native fixes it
// @see https://github.com/facebook/react-native/issues/22186
const StrictModePlaceholder = Fragment

export function App() {
  return (
    <StrictModePlaceholder>
      <ErrorBoundary>
        <AppProviders>
          <AppGlobalStyles key="app-global-styles" />
          <AppNavigator key="app-navigator" />

          <UnreadCountProvider>
            <AppIconBadge />
          </UnreadCountProvider>
        </AppProviders>
      </ErrorBoundary>
    </StrictModePlaceholder>
  )
}
