import React from 'react'
import { connect } from 'react-redux'

import * as selectors from '../redux/selectors'
import { AuthNavigator } from './AuthNavigator'
import { MainNavigator } from './MainNavigator'

const connectToStore = connect((state: any) => ({
  user: selectors.currentUserSelector(state),
}))

export const AppNavigator = connectToStore(({ user }: any) =>
  user ? <MainNavigator /> : <AuthNavigator />,
)
