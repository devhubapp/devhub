// @flow

import React from 'react';

import orientationListener, { Orientation } from '../libs/orientation-listener';

// eslint-disable-next-line
export default Component => class extends React.PureComponent {
  state = ({
    orientation: 'PORTRAIT',
  }: {
    orientation: Orientation,
  });

  onOrientationChange = ({ orientation }) => {
    this.setState({ orientation });
  };

  componentDidMount() {
    orientationListener.getOrientation((orientation) => {
      this.setState({ orientation });
    });

    orientationListener.addListener(this.onOrientationChange);
  }

  componentWillUnmount() {
    orientationListener.removeListener(this.onOrientationChange);
  }

  render() {
    const { orientation } = this.state;

    return (
      <Component orientation={orientation} {...this.props} />
    );
  }
};
