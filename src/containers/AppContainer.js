import React from 'react';
import styled, { ThemeProvider } from 'styled-components/native';
import { Client } from 'bugsnag-react-native';
import { connect } from 'react-redux';
import { StatusBar } from 'react-native';
import { StackNavigation, withNavigation } from '@exponent/ex-navigation';

import {
  isLoggedSelector,
  isLoggingInSelector,
  rehydratedSelector,
  themeSelector,
} from '../selectors';

import type { State, ThemeObject } from '../utils/types';

const View = styled.View`
  flex: 1;
`;

const mapStateToProps = (state: State) => ({
  isLogged: isLoggedSelector(state),
  isLoggingIn: isLoggingInSelector(state),
  rehydrated: rehydratedSelector(state),
  theme: themeSelector(state),
});

@withNavigation
@connect(mapStateToProps)
export default class extends React.PureComponent {
  constructor(props) {
    super(props);

    this.client = new Client('231f337f6090422c611017d3dab3d32e');
  }

  componentWillReceiveProps(props) {
    this.handleIsLoggedStatus(props);
  }

  handleIsLoggedStatus = ({ isLogged, navigation, rehydrated }) => {
    if (!rehydrated) return;

    const navigator = navigation.getNavigator('root');

    // if (isLoggingIn) {
    //   navigator.replace('empty');
    // } else

    if (isLogged && isLogged !== this.props.isLogged) {
      navigator.replace('main');
    } else {
      navigator.replace('login');
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
