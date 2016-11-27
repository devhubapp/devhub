// @flow

import React from 'react';
import styled from 'styled-components/native';
import { Button } from 'react-native';
import { connect } from 'react-redux';

import Screen from '../components/Screen';
import ThemeProvider from '../components/ThemeProvider';
import { loadTheme } from '../reducers/config';
import { setTheme } from '../actions';
import type { State, ThemeObject } from '../utils/types';

const Footer = styled.View`
  flex: 1;
  justify-content: flex-end;
`;

type Props = {
  setTheme: Function,
  theme: ThemeObject,
};

const Page = ({ setTheme, theme }: Props) => (
  <ThemeProvider theme={theme}>
    <Screen>
      <Footer>
        <Button title="Auto" color={theme.base04} onPress={() => setTheme('auto')}/>
        <Button title="Light" color={theme.base04} onPress={() => setTheme('light')}/>
        <Button title="Dark" color={theme.base04} onPress={() => setTheme('dark')}/>
        <Button title="Dark Blue" color={theme.base04} onPress={() => setTheme('dark-blue')}/>
      </Footer>
    </Screen>
  </ThemeProvider>
);

const mapStateToProps = ({ config }: State) => ({ config, theme: loadTheme(config) });
const mapDispatchToProps = { setTheme };

export default connect(mapStateToProps, mapDispatchToProps)(Page);
