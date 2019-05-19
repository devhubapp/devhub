import React, { Suspense } from 'react'

import { Screen } from '../components/common/Screen'
import { useReduxState } from '../hooks/use-redux-state'
import * as selectors from '../redux/selectors'

export const AppNavigator = React.memo(() => {
  const user = useReduxState(selectors.currentUserSelector)

  if (user) {
    const MainScreen = React.lazy(() => import('../screens/MainScreen'))
    return (
      <Suspense fallback={<Screen />}>
        <MainScreen key="app-main-screen" />
      </Suspense>
    )
  }

  const LoginScreen = React.lazy(() => import('../screens/LoginScreen'))
  return (
    <Suspense fallback={<Screen />}>
      <LoginScreen key="app-login-screen" />
    </Suspense>
  )
})
