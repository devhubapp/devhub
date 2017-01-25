import React from 'react';
import styled, { ThemeProvider } from 'styled-components/native';
import { connect } from 'react-redux';
import { StatusBar } from 'react-native';
import { StackNavigation, withNavigation } from '@exponent/ex-navigation';

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

@withNavigation
@connect(mapStateToProps)
export default class extends React.PureComponent {
  componentDidMount() {
    this.handleIsLoggedStatus();
  }

  componentWillReceiveProps(props) {
    this.handleIsLoggedStatus(props);
  }

  handleIsLoggedStatus = (props) => {
    const { isLogged, navigation, rehydrated } = props || this.props;

    if (!rehydrated) return;

    try {
      const navigator = navigation.getNavigator('root');
      if (!navigator) return;

      if (isLogged && isLogged !== this.props.isLogged) {
        // settimeout to prevent delay of theme initialization
        setTimeout(() => {
          navigator.replace('main');
        }, 100);
      } else if (!isLogged) {
        navigator.replace('login');
      }
    } catch (e) {
      // navigator was probably not initialized yet
      // try again
      setTimeout(this.handleIsLoggedStatus, 200);
    }
  };

  props: {
    isLogged?: boolean,
    navigation?: Object,
    rehydrated?: boolean,
    theme: ThemeObject,
  };

  render() {
    const { theme } = this.props;

    return (
      <ThemeProvider theme={theme}>
        <View>
          <StatusBar
            backgroundColor={theme.base01}
            barStyle={theme.isDark ? 'light-content' : 'dark-content'}
          />

          <StackNavigation id="root" initialRoute="splash" />
        </View>
      </ThemeProvider>
    );
  }
}
