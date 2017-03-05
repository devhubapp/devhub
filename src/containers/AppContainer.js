import React from 'react';
import styled, { ThemeProvider } from 'styled-components/native';
import { connect } from 'react-redux';
import { Platform, StatusBar } from 'react-native';

import MainAppNavigatorContainer from './navigators/MainAppNavigatorContainer';
import PublicAppNavigatorContainer from './navigators/PublicAppNavigatorContainer';
import SettingsScreen from '../containers/screens/SettingsScreen';
import SplashScreen from '../containers/screens/SplashScreen';

import {
  isLoggedSelector,
  isReadySelector,
  themeSelector,
} from '../selectors';

import type { State, ThemeObject } from '../utils/types';

const View = styled.View`
  flex: 1;
`;

const mapStateToProps = (state: State) => ({
  isLogged: isLoggedSelector(state),
  ready: isReadySelector(state),
  theme: themeSelector(state),
});

@connect(mapStateToProps)
export default class extends React.PureComponent {
  static defaultProps = {
    isLogged: false,
    ready: false,
    theme: {},
  };

  props: {
    isLogged?: boolean,
    ready?: boolean,
    theme: ThemeObject,
  };

  renderMainContent() {
    const { isLogged, ready } = this.props;

    try {
      if (!ready) return <SplashScreen />;
      return isLogged ? <MainAppNavigatorContainer /> : <PublicAppNavigatorContainer />;
    } catch (e) {
      return <SettingsScreen />;
    }
  }

  render() {
    const { theme } = this.props;

    return (
      <ThemeProvider theme={theme}>
        <View>
          {(Platform.OS === 'ios' || Platform.OS === 'android') &&
            <StatusBar
              backgroundColor={theme.statusBarBackground || theme.base00}
              barStyle={theme.isDark ? 'light-content' : 'dark-content'}
            />}

          {this.renderMainContent()}
        </View>
      </ThemeProvider>
    );
  }
}
