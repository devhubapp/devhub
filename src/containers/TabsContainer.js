// @flow

import React from 'react';
import { ThemeProvider } from 'styled-components/native';
import { connect } from 'react-redux';

import TabNavigationLayout from '../navigation/TabNavigationLayout';
import { loadTheme } from '../reducers/config';
import type { State, ThemeObject } from '../utils/types';

type Props = {
  theme: ThemeObject,
};

const TabsContainer = ({ theme }: Props) => (
  <TabNavigationLayout theme={theme} />
);

const mapStateToProps = ({ config }: State) => ({ theme: loadTheme(config) });

export default connect(mapStateToProps)(TabsContainer);
