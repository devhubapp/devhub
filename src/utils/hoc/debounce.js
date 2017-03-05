// @flow

import React from 'react';
import debounce from 'lodash/throttle';

export default (intervalOrFn, ...debounceArgs) => {
  if (!(
    typeof intervalOrFn === 'function'
      || (typeof intervalOrFn === 'number' && intervalOrFn > 0)
    )) {
    throw new Error(`[debounce] Interval parameter must be a number (ms) or a function(props) => number. Received ${intervalOrFn}.`);
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
      debounce(this.updateStateWithProps, interval, ...debounceArgs)(props);
    };

    render = () => <Component {...this.state.props} />;
  };
};
