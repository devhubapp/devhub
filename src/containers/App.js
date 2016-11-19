// @flow

import React from 'react';
import styled, { ThemeProvider } from 'styled-components/native';
import { connect } from 'react-redux';

import { setTheme } from '../actions';
import type { State } from '../utils/types';

const StyledView = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.base00};
`;

const App = ({ theme, ...props }: State) => (
  <ThemeProvider theme={theme}>
    <StyledView {...props} />
  </ThemeProvider>
);

const mapStateToProps = ({ config, theme }: State) => ({
  config,
  theme,
});

const mapDispatchToProps = {
  setTheme,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
