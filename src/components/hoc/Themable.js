// @flow

import React from 'react';
import { CHANNEL } from 'styled-components/lib/models/ThemeProvider';

import { ThemeObject } from '../../utils/types';

export default Component => class extends React.Component {
  static contextTypes = {
    [CHANNEL]: React.PropTypes.func,
  };

  state = ({
    theme: undefined,
  }: {
    theme: ThemeObject,
  });

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
    const { theme } = this.state;

    return <Component theme={theme || this.context.theme} {...this.props} />
  }
}
