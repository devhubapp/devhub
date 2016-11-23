// @flow

import React from 'react';
import styled from 'styled-components';
import { Button } from 'react-native';
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

const Page = ({ setTheme, theme }: Props) => (
  <ThemeProvider theme={theme}>
    <Screen>
      <Button title="Light" color={theme.base04} onPress={() => setTheme('light')} />
      <Button title="Dark" color={theme.base04} onPress={() => setTheme('dark')} />
      <Button title="Dark Blue" color={theme.base04} onPress={() => setTheme('dark-blue')} />
    </Screen>
  </ThemeProvider>
);

const mapStateToProps = ({ config }: State) => ({ config, theme: loadTheme(config) });
const mapDispatchToProps = { setTheme };

export default connect(mapStateToProps, mapDispatchToProps)(Page);
