// @flow

import React from 'react'
import styled, { ThemeProvider } from 'styled-components/native'
import { connect } from 'react-redux'
import { Platform, StatusBar } from 'react-native'

import AppNavigatorContainer from './navigators/AppNavigatorContainer'
import FaviconBadge from '../libs/favicon-badge'
import { Helmet } from '../libs/helmet'
import { NavigationActions } from '../libs/navigation'
import { get } from '../utils/immutable'

import {
  getSelectedRouteFromNavigationState,
  isFetchingSelector,
  isLoggedSelector,
  isReadySelector,
  notificationsUnreadCountSelector,
  themeSelector,
} from '../selectors'

import type { State, ThemeObject } from '../utils/types'

const View = styled.View`
  flex: 1;
`

const mapStateToProps = (state: State) => ({
  isLogged: isLoggedSelector(state),
  isFetching: isFetchingSelector(state),
  notificationsCount: (isLoggedSelector(state) &&
    notificationsUnreadCountSelector(state)) ||
    0,
  ready: isReadySelector(state),
  theme: themeSelector(state),
})

@connect(mapStateToProps)
export default class AppContainer extends React.PureComponent {
  static defaultProps = {
    isLogged: false,
    isFetching: false,
    notificationsCount: 0,
    ready: false,
    theme: {},
  }

  constructor(props) {
    super(props)
    this.updateNavigator(props)
  }

  componentWillReceiveProps(props) {
    this.updateNavigator(props)
  }

  updateNavigator({ isLogged, ready }) {
    if (!this.navigation) return

    const routeName = !ready ? 'splash' : isLogged ? 'main' : 'login'

    const currentRouteState = getSelectedRouteFromNavigationState(
      this.navigation.state,
    )
    if (get(currentRouteState, 'routeName') === routeName) return

    this.navigation.dispatch(
      NavigationActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName })],
      }),
    )
  }

  props: {
    isLogged?: boolean, // eslint-disable-line react/no-unused-prop-types
    isFetching?: boolean,
    notificationsCount?: number,
    ready?: boolean, // eslint-disable-line react/no-unused-prop-types
    theme: ThemeObject,
  }

  navigation = null

  render() {
    const { isFetching, notificationsCount, theme } = this.props

    return (
      <ThemeProvider theme={theme}>
        <View>
          {Platform.OS === 'web' &&
            <Helmet>
              <meta name="theme-color" content={theme.base00} />
              <meta
                name="apple-mobile-web-app-status-bar-style"
                content={theme.isDark ? 'black-translucent' : 'default'}
              />
            </Helmet>}

          {Platform.OS === 'web' &&
            <FaviconBadge
              animation="none"
              badgeCount={notificationsCount}
              bgColor={theme.red}
            />}

          {(Platform.OS === 'ios' || Platform.OS === 'android') &&
            <StatusBar
              backgroundColor={theme.statusBarBackground || theme.base00}
              barStyle={theme.isDark ? 'light-content' : 'dark-content'}
              networkActivityIndicatorVisible={isFetching}
            />}

          <AppNavigatorContainer
            navigationRef={ref => {
              this.navigation = ref
            }}
          />
        </View>

      </ThemeProvider>
    )
  }
}
