// @flow

import React from 'react';
import Orientation from 'react-native-orientation-listener';

export default Component => class extends React.PureComponent {
  state = {
    orientation: null,
  };

  onOrientationChange = ({ orientation }) => {
    this.setState({ orientation });
  };

  componentDidMount() {
    Orientation.getOrientation((orientation) => {
      this.setState({ orientation });
    });
  }

  componentDidMount() {
    Orientation.addListener(this.onOrientationChange);
  }

  componentWillUnmount() {
    Orientation.removeListener(this.onOrientationChange);
  }

  render() {
    const { orientation } = this.state;

    return (
      <Component orientation={orientation} {...this.props} />
    );
  }
}
