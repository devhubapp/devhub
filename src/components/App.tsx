import React, { PureComponent } from 'react'
import { Provider as ReduxProvider } from 'react-redux'

import { AppNavigator } from '../navigation/AppNavigator'
import { store } from '../redux/store'
import { AppGlobalStyles } from './AppGlobalStyles'
import { ColumnsProvider } from './context/ColumnsContext'
import { DimensionsProvider } from './context/DimensionsContext'
import { ThemeProvider } from './context/ThemeContext'
import { UserConsumer, UserProvider } from './context/UserContext'

export class App extends PureComponent {
  render() {
    return (
      <ReduxProvider store={store}>
        <DimensionsProvider>
          <UserProvider>
            <ThemeProvider>
              <UserConsumer>
                {({ user }) => (
                  <ColumnsProvider username={(user && user.login) || null}>
                    <>
                      <AppGlobalStyles />
                      <AppNavigator />
                    </>
                  </ColumnsProvider>
                )}
              </UserConsumer>
            </ThemeProvider>
          </UserProvider>
        </DimensionsProvider>
      </ReduxProvider>
    )
  }
}
