// @flow

import React from 'react';
import styled, { withTheme } from 'styled-components/native';
import { Button, Platform } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import pkg from '../../../package.json';
import Screen from '../../components/Screen';
import TabIcon from '../../components/TabIcon';
import { contentPadding } from '../../styles/variables';
import * as actionCreators from '../../actions';
import type { ActionCreators, ThemeObject } from '../../utils/types';

const Wrapper = styled.View`
  flex: 1;
  justify-content: space-between;
  padding: ${contentPadding}px;
`;

const Main = styled.View`
  flex: 1;
`;

const Footer = styled.View`
  justify-content: center;
`;

const StyledButton = styled(Button)`
  marginTop: ${contentPadding / 2};
`;

const Text = styled.Text`
  marginTop: ${contentPadding / 2};
  color: ${({ theme }) => theme.base04};
  text-align: center;
`;

const MutedText = styled(Text)`
  color: ${({ theme }) => theme.base05};
`;

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actionCreators, dispatch),
});

@withTheme
@connect(null, mapDispatchToProps)
class SettingsScreen extends React.PureComponent {
  static navigationOptions;

  props: {
    actions: ActionCreators,
    theme: ThemeObject,
  };

  render() {
    const { actions: { resetAppData, logout, setTheme }, theme } = this.props;

    const color = Platform.OS === 'android'
      ? !theme.isDark ? theme.base05 : theme.base02
      : theme.base04;

    return (
      <Screen>
        <Wrapper>
          <Main>
            <StyledButton
              title="Reset app data"
              color={theme.red}
              onPress={() => resetAppData()}
            />
            <StyledButton title="Logout" color={theme.red} onPress={() => logout()} />
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
            <MutedText>v{pkg.codeBundleId || pkg.version}</MutedText>
          </Footer>
        </Wrapper>
      </Screen>
    );
  }
}

SettingsScreen.navigationOptions = {
  tabBar: {
    label: 'Me',
    icon: ({ tintColor }: { tintColor: 'string' }) => (
      <TabIcon icon="octoface" color={tintColor} />
    ),
  },
};

export default SettingsScreen;
