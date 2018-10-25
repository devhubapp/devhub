import React from 'react'
import { connect } from 'react-redux'

import * as selectors from '../redux/selectors'
import { AuthStackNavigator } from './AuthStackNavigator'
import { MainTabNavigator } from './MainTabNavigator'

const connectToStore = connect((state: any) => ({
  user: selectors.currentUserSelector(state),
}))

export const AppNavigator = connectToStore(
  ({ user }: any) => (user ? <MainTabNavigator /> : <AuthStackNavigator />),
)
