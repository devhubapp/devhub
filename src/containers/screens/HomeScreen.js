// @flow

import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Columns from '../../components/Columns';
import Screen from '../../components/Screen';
import columnsSelector from '../../selectors/columns';
import * as actionCreators from '../../actions';
import type { ActionCreators, Column, State } from '../../utils/types';

const mapStateToProps = (state: State) => ({
  rehydrated: state.getIn(['app', 'rehydrated']),
  columns: columnsSelector(state),
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actionCreators, dispatch),
});

@connect(mapStateToProps, mapDispatchToProps)
export default class extends React.PureComponent {
  props: {
    actions: ActionCreators,
    columns: Array<Column>,
    rehydrated: boolean,
  };

  render() {
    const { actions, columns, rehydrated } = this.props;

    return (
      <Screen>
        {rehydrated ? <Columns columns={columns} actions={actions} /> : null}
      </Screen>
    );
  }
}
