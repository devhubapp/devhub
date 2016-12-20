// @flow

import React from 'react';
import debounce from 'lodash/debounce';

export default (interval, ...debounceArgs) => {
  if (typeof interval !== 'number' && interval > 0) {
    throw new Error('[debounce] Interval (ms) parameter not received.');
  }

  return Component => class extends React.PureComponent {
    constructor(props) {
      super(props);

      this.state = props;
    }

    updateStateWithProps = (props) => this.setState(props || this.props);
    componentWillReceiveProps = debounce(this.updateStateWithProps, interval, ...debounceArgs);
    render = () => <Component {...this.state} />;
  };
};
