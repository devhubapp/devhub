// @flow

import React from 'react';
import throttle from 'lodash/throttle';

export default (interval, ...throttleArgs) => {
  if (typeof interval !== 'number' && interval > 0) {
    throw new Error('[throttle] Interval (ms) parameter not received.');
  }

  return Component => class extends React.PureComponent {
    constructor(props) {
      super(props);

      this.state = props;
    }

    updateStateWithProps = (props) => this.setState(props || this.props);
    componentWillReceiveProps = throttle(this.updateStateWithProps, interval, ...throttleArgs);
    render = () => <Component {...this.state} />;
  };
};
