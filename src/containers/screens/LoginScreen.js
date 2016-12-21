// @flow

import React from 'react';
import styled from 'styled-components/native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import GithubButton from '../../components/buttons/GithubButton';
import Screen from '../../components/Screen';
import * as actionCreators from '../../actions';
import { isLoggingInSelector } from '../../selectors';
import { contentPadding, radius } from '../../styles/variables';
import type { ActionCreators, State } from '../../utils/types';

const Main = styled.View`
  flex: 1;
  padding: ${contentPadding};
`;

const Footer = styled.View`
  padding: ${contentPadding};
`;

const StyledGithubButton = styled(GithubButton) `
  margin-top: ${contentPadding / 2};
`;

const mapStateToProps = (state: State) => ({
  isLoggingIn: isLoggingInSelector(state),
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actionCreators, dispatch),
});

@connect(mapStateToProps, mapDispatchToProps)
export default class extends React.PureComponent {
  state = ({
    isLoggingIn: false,
    loggingInMethod: null,
  }: {
    isLoggingIn: boolean,
    loggingInMethod: 'github.public' | 'github.private',
  });

  loginWithGithubPublicAccess = () => {
    const { actions: { loginRequest } } = this.props;

    this.setState({ loggingInMethod: 'github.public' });
    loginRequest({ provider: 'github', scopes: 'user public_repo notifications read:org' });
  };

  loginWithGithubPrivateAccess = () => {
    const { actions: { loginRequest } } = this.props;

    this.setState({ loggingInMethod: 'github.private' });
    loginRequest({ provider: 'github', scopes: 'user repo notifications read:org' });
  }

  props: {
    actions: ActionCreators,
    isLoggingIn?: boolean,
  };

  render() {
    const { loggingInMethod } = this.state;
    const { isLoggingIn } = this.props;

    return (
      <Screen>
        <Main />

        <Footer>
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
        </Footer>
      </Screen>
    );
  }
}
