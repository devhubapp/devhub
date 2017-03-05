import { addNavigationHelpers } from 'react-navigation';

import React from 'react';
import { connect } from 'react-redux';

import Navigator from '../../navigation/PublicAppNavigator';

import type { State } from '../../utils/types';

const mapStateToProps = (state: State) => ({
  navigationState: state.getIn(['navigation', 'public']),
});

@connect(mapStateToProps)
export default class extends React.PureComponent {
  static defaultProps = {
    dispatch: undefined,
    navigationState: undefined,
  };

  props: {
    dispatch?: Function,
    navigationState?: ?any,
  };

  render() {
    const { dispatch, navigationState: state } = this.props;

    return (
      <Navigator navigation={addNavigationHelpers({ dispatch, state })} />
    );
  }
}
