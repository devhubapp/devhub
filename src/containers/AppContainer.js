import React from 'react';
import styled, { ThemeProvider } from 'styled-components/native';
import { connect } from 'react-redux';
import { Platform, StatusBar } from 'react-native';

import MainAppNavigator from '../navigation/MainAppNavigator';
import PublicAppNavigator from '../navigation/PublicAppNavigator';
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

  render() {
    const { isLogged, ready, theme } = this.props;

    return (
      <ThemeProvider theme={theme}>
        <View>
          {(Platform.OS === 'ios' || Platform.OS === 'android') &&
            <StatusBar
              backgroundColor={theme.statusBarBackground || theme.base00}
              barStyle={theme.isDark ? 'light-content' : 'dark-content'}
            />}

          {ready
            ? isLogged ? <MainAppNavigator /> : <PublicAppNavigator />
            : <SplashScreen />}
        </View>
      </ThemeProvider>
    );
  }
}
