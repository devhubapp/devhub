// @flow

import React from 'react';
import { connect } from 'react-redux';

import Columns from '../components/Columns';
import Screen from '../components/Screen';
import ThemeProvider from '../components/ThemeProvider';
import { loadTheme } from '../reducers/config';
import type { State, ThemeObject } from '../utils/types';

type Props = {
  feed: Array,
  theme: ThemeObject,
};

const Page = ({ feed, theme }: Props) => (
  <ThemeProvider theme={theme}>
    <Screen>
      <Columns data={feed} />
    </Screen>
  </ThemeProvider>
);

const mapStateToProps = ({ feed, config }: State) => ({ feed, theme: loadTheme(config) });

export default connect(mapStateToProps)(Page);
