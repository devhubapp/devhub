// @flow

import React from 'react';
import throttle from 'lodash/throttle';

export default (intervalOrFn, ...throttleArgs) => {
  if (!(
    typeof intervalOrFn === 'function'
      || (typeof intervalOrFn === 'number' && intervalOrFn > 0)
    )) {
    throw new Error(`[throttle] Interval parameter must be a number (ms) or a function(props) => number. Received ${intervalOrFn}.`);
  }

  return Component => class extends React.PureComponent {
    constructor(props) {
      super(props);

      this.state = { props };
    }

    updateStateWithProps = props => {
      this.setState({ props: props || this.props });
    };

    componentWillReceiveProps = props => {
      const interval = typeof intervalOrFn === 'function' ? intervalOrFn(props) : intervalOrFn;
      throttle(this.updateStateWithProps, interval, ...throttleArgs)(props);
    };

    render = () => <Component {...this.state.props} />;
  };
};
