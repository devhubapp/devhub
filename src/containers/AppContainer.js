import React from 'react';
import styled, { ThemeProvider } from 'styled-components/native';
import { connect } from 'react-redux';
import { Platform, StatusBar } from 'react-native';

import MainAppNavigator from '../navigation/MainAppNavigator';
import PublicAppNavigator from '../navigation/PublicAppNavigator';
import SplashScreen from '../containers/screens/SplashScreen';

import {
  isLoggedSelector,
  rehydratedSelector,
  themeSelector,
} from '../selectors';

import type { State, ThemeObject } from '../utils/types';

const View = styled.View`
  flex: 1;
`;

const mapStateToProps = (state: State) => ({
  isLogged: isLoggedSelector(state),
  rehydrated: rehydratedSelector(state),
  theme: themeSelector(state),
});

@connect(mapStateToProps)
export default class extends React.PureComponent {
  static defaultProps = {
    isLogged: false,
    rehydrated: false,
    theme: {},
  };

  props: {
    isLogged?: boolean,
    rehydrated?: boolean,
    theme: ThemeObject,
  };

  render() {
    const { isLogged, rehydrated, theme } = this.props;

    return (
      <ThemeProvider theme={theme}>
        <View>
          {(Platform.OS === 'ios' || Platform.OS === 'android') &&
            <StatusBar
              backgroundColor={theme.base01}
              barStyle={theme.isDark ? 'light-content' : 'dark-content'}
            />}

          {rehydrated
            ? isLogged ? <MainAppNavigator /> : <PublicAppNavigator />
            : <SplashScreen />}
        </View>
      </ThemeProvider>
    );
  }
}
