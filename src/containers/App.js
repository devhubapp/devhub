import React from 'react';
import styled from 'styled-components/native';
import { StatusBar } from 'react-native';
import { connect } from 'react-redux';

const View = styled.View`
  flex: 1;
`;

import ThemeProvider from '../components/ThemeProvider';
import { loadTheme } from '../reducers/config';
import type { State, ThemeObject } from '../utils/types';

type Props = {
  children: React.Element,
  theme: ThemeObject,
};

const App = ({ children, theme }: Props) => (
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

const mapStateToProps = ({ config }: State) => ({ theme: loadTheme(config) });

export default connect(mapStateToProps)(App);
