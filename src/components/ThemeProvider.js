// @flow

import React from 'react';
import { ThemeProvider } from 'styled-components/native';

import type { ThemeObject } from '../utils/types';

export default class extends React.Component {
  static childContextTypes = {
    theme: React.PropTypes.object.isRequired,
  };

  static contextTypes = {
    theme: React.PropTypes.object,
  };

  getChildContext = () => ({
    theme: this.props.theme || this.context.theme,
  });

  props: {
    children?: ?React.Element<*>,
    theme: ThemeObject,
  };

  render() {
    const { children } = this.props;
    const theme = this.props.theme || this.context.theme;

    return (
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    );
  }
}
