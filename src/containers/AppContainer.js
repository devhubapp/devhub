import React from 'react';
import styled, { ThemeProvider } from 'styled-components/native';
import { connect } from 'react-redux';
import { Platform, StatusBar } from 'react-native';

import AppNavigatorContainer from './navigators/AppNavigatorContainer';
import { NavigationActions } from '../libs/navigation';

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

  constructor(props) {
    super(props);
    this.updateNavigator(props);
  }

  componentWillReceiveProps(props) {
    this.updateNavigator(props);
  }

  updateNavigator({ isLogged, ready }) {
    if (!this.navigation) return;

    const routeName = !ready ? 'splash' :
      isLogged ? 'main' : 'login';

    this.navigation.dispatch(NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName }),
      ],
    }));
  }

  props: {
    isLogged?: boolean,
    ready?: boolean,
    theme: ThemeObject,
  };

  navigation = null;

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

          <AppNavigatorContainer navigationRef={ref => { this.navigation = ref; }} />
        </View>
      </ThemeProvider>
    );
  }
}
