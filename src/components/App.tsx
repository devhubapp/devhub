import React, { PureComponent } from 'react'

import AppNavigator from '../navigation/AppNavigator'
import { ColumnsProvider } from './context/ColumnsContext'
import { DimensionsProvider } from './context/DimensionsContext'
import { ThemeProvider } from './context/ThemeContext'
import { UserConsumer, UserProvider } from './context/UserContext'

export default class App extends PureComponent {
  render() {
    return (
      <DimensionsProvider>
        <UserProvider>
          <ThemeProvider>
            <UserConsumer>
              {({ user }) => (
                <ColumnsProvider username={(user && user.login) || null}>
                  <AppNavigator />
                </ColumnsProvider>
              )}
            </UserConsumer>
          </ThemeProvider>
        </UserProvider>
      </DimensionsProvider>
    )
  }
}
