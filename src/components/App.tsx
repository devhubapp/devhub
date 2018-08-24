import React, { PureComponent } from 'react'

import AppNavigator from '../navigation/AppNavigator'
import { DimensionsProvider } from './context/DimensionsContext'
import { UserProvider } from './context/UserContext'

export default class App extends PureComponent {
  render() {
    return (
      <DimensionsProvider>
        <UserProvider>
          <AppNavigator />
        </UserProvider>
      </DimensionsProvider>
    )
  }
}
