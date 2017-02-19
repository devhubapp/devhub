// @flow

import React from 'react';
import styled, { withTheme } from 'styled-components/native';
import { Button, Platform } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Screen from '../../components/Screen';
import TabIcon from '../../components/TabIcon';
import * as actionCreators from '../../actions';
import type { ActionCreators, ThemeObject } from '../../utils/types';

const Wrapper = styled.View`
  flex: 1;
  justify-content: space-between;
`;

const Main = styled.View`
  flex: 1;
`;

const Footer = styled.View`
  justify-content: center;
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
    const { actions: { clearAppData, logout, setTheme }, theme } = this.props;

    const color = Platform.OS === 'android'
      ? !theme.isDark ? theme.base05 : theme.base02
      : theme.base04;

    return (
      <Screen>
        <Wrapper>
          <Main>
            <Button
              title="Clear app data"
              color={theme.red}
              onPress={() => clearAppData()}
            />
          </Main>

          <Footer>
            <Button
              title="Auto"
              color={color}
              onPress={() => setTheme('auto')}
            />
            <Button
              title="Light"
              color={color}
              onPress={() => setTheme('light')}
            />
            <Button
              title="Dark"
              color={color}
              onPress={() => setTheme('dark')}
            />
            <Button
              title="Dark Blue"
              color={color}
              onPress={() => setTheme('dark-blue')}
            />
            <Button title="Logout" color={theme.red} onPress={() => logout()} />
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
