import React from 'react';
import styled, { ThemeProvider } from 'styled-components/native';
import { connect } from 'react-redux';
import { StatusBar } from 'react-native';

import { loadTheme } from '../reducers/config';
import type { State, ThemeObject } from '../utils/types';

const View = styled.View`
  flex: 1;
`;

const mapStateToProps = ({ config }: State) => ({ theme: loadTheme(config) });

@connect(mapStateToProps)
export default class extends React.PureComponent {
  props: {
    children: React.Element,
    theme: ThemeObject,
  };

  render() {
    const { children, theme } = this.props;

    return (
      <ThemeProvider theme={theme}>
        <View>
          <StatusBar
            backgroundColor={theme.base01}
            barStyle={theme.isDark ? 'light-content' : 'dark-content'}
          />

          {children}
        </View>
      </ThemeProvider>
    );
  }
}
