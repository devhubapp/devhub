// @flow

import React from 'react';
import { Button } from 'react-native';
import { connect } from 'react-redux';

import TabNavigationLayout from '../components/TabNavigationLayout';
import ThemeProvider from '../components/ThemeProvider';
import { loadTheme } from '../reducers/config';
import { setTheme } from '../actions';
import type { State, ThemeObject } from '../utils/types';

type Props = {
  setTheme: Function,
  theme: ThemeObject,
};

const Page = ({ setTheme, theme }: Props) => (
  <ThemeProvider theme={theme}>
    <TabNavigationLayout />
  </ThemeProvider>
);

const mapStateToProps = ({ config }: State) => ({ theme: loadTheme(config) });

export default connect(mapStateToProps)(Page);
