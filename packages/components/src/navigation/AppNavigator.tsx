import React from 'react'

import { useReduxState } from '../redux/hooks/use-redux-state'
import * as selectors from '../redux/selectors'
import { LoginScreen } from '../screens/LoginScreen'
import { MainScreen } from '../screens/MainScreen'

export function AppNavigator() {
  const user = useReduxState(selectors.currentUserSelector)
  return user ? <MainScreen /> : <LoginScreen />
}
