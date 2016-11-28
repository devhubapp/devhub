// @flow

import React from 'react';
import { CHANNEL } from 'styled-components/lib/models/ThemeProvider';

import type { ThemeObject } from '../../utils/types';

export default (Component: React.Element<*>) => class extends React.Component {
  static contextTypes = {
    [CHANNEL]: React.PropTypes.func,
  };

  state = ({
    theme: this.props.theme || this.context.theme,
  }: {
    theme?: ?ThemeObject,
  });

  unsubscribe: Function;

  componentWillMount() {
    const subscribe = this.context[CHANNEL];
    this.unsubscribe = subscribe(theme => {
      this.setState({ theme })
    });
  }

  componentWillUnmount() {
    if (typeof this.unsubscribe === 'function') this.unsubscribe();
  }

  render() {
    const { theme: stateTheme } = this.state;
    const { theme: propsTheme, ...props } = this.props;
    const { theme: contextTheme } = this.context;

    return <Component theme={stateTheme || propsTheme || contextTheme} {...props} />
  }
}
