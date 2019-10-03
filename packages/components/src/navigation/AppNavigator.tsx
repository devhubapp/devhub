import React from 'react'

import { ElectronTitleBar } from '../components/ElectronTitleBar'
import { useReduxState } from '../hooks/use-redux-state'
import { Platform } from '../libs/platform'
import * as selectors from '../redux/selectors'
import { LoginScreen } from '../screens/LoginScreen'
import { MainScreen } from '../screens/MainScreen'

export const AppNavigator = React.memo(() => {
  const user = useReduxState(selectors.currentUserSelector)

  return (
    <>
      {!!Platform.isElectron && <ElectronTitleBar />}

      {user ? (
        <MainScreen key="app-main-screen" />
      ) : (
        <LoginScreen key="app-login-screen" />
      )}
    </>
  )
})

AppNavigator.displayName = 'AppNavigator'
