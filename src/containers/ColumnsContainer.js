// @flow

import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Columns from '../components/Columns';
import { columnListSelector } from '../selectors';
import * as actionCreators from '../actions';
import type { ActionCreators, Column as ColumnType, State } from '../utils/types';

const mapStateToProps = (state: State) => ({
  columns: columnListSelector(state),
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actionCreators, dispatch),
});

@connect(mapStateToProps, mapDispatchToProps)
export default class extends React.PureComponent {
  props: {
    actions: ActionCreators,
    columns: Array<ColumnType>,
  };

  render() {
    const { actions, columns, ...props } = this.props;

    return (
      <Columns
        key="columns-container"
        actions={actions}
        columns={columns}
        {...props}
      />
    );
  }
}
