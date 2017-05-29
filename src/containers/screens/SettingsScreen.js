// @flow

import React from 'react'
import styled, { withTheme } from 'styled-components/native'
import { Button, Platform } from 'react-native'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import withIsCurrentRoute from '../../utils/hoc/withIsCurrentRoute'
import AppVersion from '../../components/AppVersion'
import Screen from '../../components/Screen'
import TabIcon from '../../components/TabIcon'
import * as actionCreators from '../../actions'
import { contentPadding } from '../../styles/variables'
import { getMainNavigationState } from '../../selectors'
import type { ActionCreators, ThemeObject } from '../../utils/types'

const Wrapper = styled.View`
  flex: 1;
  justify-content: space-between;
  padding: ${contentPadding}px;
`

const Main = styled.View`
  flex: 1;
`

const Footer = styled.View`
  justify-content: center;
`

const StyledButton = styled(Button)`
  marginTop: ${contentPadding / 2};
`

const StyledAppVersion = styled(AppVersion)`
  marginTop: ${contentPadding / 2};
  text-align: center;
`

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actionCreators, dispatch),
})

@withTheme
@withIsCurrentRoute(getMainNavigationState)
@connect(null, mapDispatchToProps)
class SettingsScreen extends React.PureComponent {
  static navigationOptions

  props: {
    actions: ActionCreators,
    isCurrentRoute: boolean,
    theme: ThemeObject,
  }

  render() {
    const { actions, isCurrentRoute, theme } = this.props
    const { resetAccountData, logout, setTheme } = actions

    const color = Platform.OS === 'android'
      ? !theme.isDark ? theme.base05 : theme.base02
      : theme.base04

    return (
      <Screen isCurrentRoute={isCurrentRoute}>
        <Wrapper>
          <Main>
            <StyledButton
              title="Delete account"
              color={theme.red}
              onPress={() => resetAccountData()}
            />
            <StyledButton
              title="Logout"
              color={theme.red}
              onPress={() => logout()}
            />
          </Main>

          <Footer>
            <StyledButton
              title="Auto"
              color={color}
              onPress={() => setTheme('auto')}
            />
            <StyledButton
              title="Light"
              color={color}
              onPress={() => setTheme('light')}
            />
            <StyledButton
              title="Dark"
              color={color}
              onPress={() => setTheme('dark')}
            />
            <StyledButton
              title="Dark Blue"
              color={color}
              onPress={() => setTheme('dark-blue')}
            />
            <StyledAppVersion />
          </Footer>
        </Wrapper>
      </Screen>
    )
  }
}

const tabBarIcon = ({ tintColor }: { tintColor: 'string' }) => (
  <TabIcon icon="octoface" color={tintColor} />
)

SettingsScreen.navigationOptions = {
  tabBarLabel: 'Me',
  tabBarIcon,
}

export default SettingsScreen
