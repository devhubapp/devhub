import React from 'react'
import { connect } from 'react-redux'

import * as selectors from '../redux/selectors'
import { LoginScreen } from '../screens/LoginScreen'
import { MainScreen } from '../screens/MainScreen'

const connectToStore = connect((state: any) => ({
  user: selectors.currentUserSelector(state),
}))

export const AppNavigator = connectToStore(({ user }: any) =>
  user ? <MainScreen /> : <LoginScreen />,
)
