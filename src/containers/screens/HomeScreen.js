// @flow

import React from 'react'
import styled, { withTheme, ThemeProvider } from 'styled-components/native'
import { ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'

import withDebounce from '../../utils/hoc/withDebounce'
import withIsCurrentRoute from '../../utils/hoc/withIsCurrentRoute'
import EventColumnsContainer from '../EventColumnsContainer'
import Screen from '../../components/Screen'
import TabIcon from '../../components/TabIcon'
import { getMainNavigationState, isReadySelector } from '../../selectors'
import type { State, ThemeObject } from '../../utils/types'

const CenterView = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`

const mapStateToProps = (state: State) => ({
  ready: isReadySelector(state),
})

@connect(mapStateToProps)
@withTheme
@withIsCurrentRoute(getMainNavigationState)
@withDebounce(({ isCurrentRoute }) => (isCurrentRoute ? 0 : 10))
class HomeScreen extends React.PureComponent {
  static navigationOptions

  props: {
    isCurrentRoute: boolean,
    ready: boolean,
    theme: ThemeObject,
  }

  render() {
    const { isCurrentRoute, ready, theme } = this.props

    return (
      <ThemeProvider theme={theme}>
        <Screen backgroundColor={theme.base01} isCurrentRoute={isCurrentRoute}>
          {!ready && (
            <CenterView>
              <ActivityIndicator color={theme.base04} />
            </CenterView>
          )}

          {ready && <EventColumnsContainer />}
        </Screen>
      </ThemeProvider>
    )
  }
}

const tabBarIcon = ({ tintColor }: { tintColor: 'string' }) => (
  <TabIcon icon="home" color={tintColor} />
)

HomeScreen.navigationOptions = {
  tabBarLabel: 'Feed',
  tabBarIcon,
}

export default HomeScreen
