// @flow

import React from 'react';
import { ThemeProvider } from 'styled-components/native';
import { connect } from 'react-redux';

import Screen from '../components/Screen';
import { loadTheme } from '../reducers/config';
import { setTheme } from '../actions';
import type { State, ThemeObject } from '../utils/types';

type Props = {
  setTheme: Function,
  theme: ThemeObject,
};

const App = ({ setTheme, theme }: Props) => (
  <ThemeProvider theme={theme}>
    <Screen />
  </ThemeProvider>
);

const mapStateToProps = ({ config }: State) => ({ config, theme: loadTheme(config) });
const mapDispatchToProps = { setTheme };

export default connect(mapStateToProps, mapDispatchToProps)(App);
