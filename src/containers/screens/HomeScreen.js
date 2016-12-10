// @flow

import React from 'react';
import { connect } from 'react-redux';

import ColumnsContainer from '../ColumnsContainer';
import Screen from '../../components/Screen';
import type { State } from '../../utils/types';

const mapStateToProps = (state: State) => ({
  rehydrated: state.getIn(['app', 'rehydrated']),
});

@connect(mapStateToProps)
export default class extends React.PureComponent {
  props: {
    rehydrated: boolean,
  };

  render() {
    const { rehydrated } = this.props;

    return (
      <Screen>
        {
          rehydrated &&
          <ColumnsContainer />
        }
      </Screen>
    );
  }
}
