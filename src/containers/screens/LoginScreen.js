// @flow

import React from 'react'
import styled from 'styled-components/native'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import logo from '../../../assets/logo.png'
import AppVersion from '../../components/AppVersion'
import GithubButton from '../../components/buttons/GithubButton'
import Screen from '../../components/Screen'
import StatusMessage from '../../components/StatusMessage'
import * as actionCreators from '../../actions'
import { isLoggingSelector, userErrorSelector } from '../../selectors/user'
import { contentPadding, radius } from '../../styles/variables'
import type { ActionCreators, State } from '../../utils/types'

const Main = styled.View`
  flex: 1;
  padding: ${contentPadding}px;
`

const MainContent = styled.View`
  flex: 1;
  align-self: center;
  width: 100%;
  max-width: 400px;
  justify-content: center;
`

const Footer = styled.View`
  align-items: center;
  align-self: center;
  justify-content: center;
  padding: ${contentPadding}px;
`

const Logo = styled.Image`
  align-self: center;
  width: 100px;
  height: 100px;
  margin-bottom: ${contentPadding};
  border-radius: ${radius};
`

const StyledGithubButton = styled(GithubButton)`
  margin-top: ${contentPadding / 2}px;
`

const mapStateToProps = (state: State) => ({
  isLoggingIn: isLoggingSelector(state),
  error: userErrorSelector(state),
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actionCreators, dispatch),
})

type ComponentState = {
  isLoggingIn: boolean,
  loggingInMethod: 'github.public' | 'github.private' | null,
}

@connect(mapStateToProps, mapDispatchToProps)
export default class LoginScreen extends React.PureComponent {
  state = ({
    isLoggingIn: false,
    loggingInMethod: null,
  }: ComponentState)

  loginWithGithubPublicAccess = () => {
    const { actions: { loginRequest } } = this.props

    this.setState({ loggingInMethod: 'github.public' })
    loginRequest({
      scopes: ['user', 'public_repo', 'notifications', 'read:org'],
    })
  }

  loginWithGithubPrivateAccess = () => {
    const { actions: { loginRequest } } = this.props

    this.setState({ loggingInMethod: 'github.private' })
    loginRequest({ scopes: ['user', 'repo', 'notifications', 'read:org'] })
  }

  props: {
    actions: ActionCreators,
    error: string,
    isLoggingIn: boolean,
  }

  render() {
    const { loggingInMethod } = this.state
    const { error, isLoggingIn } = this.props

    return (
      <Screen>
        <Main>
          {error &&
            <StatusMessage key={`error-${error}`} message={error} error />}

          <MainContent>
            <Logo source={logo} resizeMode="contain" />

            <StyledGithubButton
              onPress={this.loginWithGithubPublicAccess}
              title="Sign in with GitHub"
              subtitle="Public access"
              rightIcon="globe"
              loading={isLoggingIn && loggingInMethod === 'github.public'}
              radius={radius}
            />

            <StyledGithubButton
              onPress={this.loginWithGithubPrivateAccess}
              title="Sign in with GitHub"
              subtitle="Private access"
              rightIcon="lock"
              loading={isLoggingIn && loggingInMethod === 'github.private'}
              radius={radius}
            />
          </MainContent>
        </Main>

        <Footer>
          <AppVersion showAppName />
        </Footer>
      </Screen>
    )
  }
}
