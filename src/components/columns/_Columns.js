// @flow

import React from 'react';
import styled from 'styled-components/native';
import ImmutableListView from 'react-native-immutable-list-view';
import { List } from 'immutable';

import NewColumn from './NewColumn';
import withOrientation from '../../hoc/withOrientation';
import { getFullWidth, getWidth } from './_Column';
import type { ActionCreators } from '../../utils/types';

export const StyledImmutableListViewListView = styled(ImmutableListView)`
  flex: 1;
`;

@withOrientation
export default class extends React.PureComponent {
  props: {
    actions: ActionCreators,
    addColumnFn?: ?Function,
    columns: Array<any>,
    radius?: number,
    renderRow: Function,
    width?: number,
  };

  renderNewColumn(column) {
    const { actions, addColumnFn, radius, width } = this.props;

    if (!addColumnFn) return null;

    const _addColumnFn = column
      ? addColumnFn.bind(this, { order: column.get('order') })
      : addColumnFn;

    return (
      <NewColumn
        addColumnFn={_addColumnFn}
        actions={actions}
        radius={radius}
        width={width || getWidth()}
        outline
      />
    );
  }

  renderRow = mainRenderRow => (column, ...otherArgs) => {
    if (!column) return null;

    if (column.get('id') === 'new') return this.renderNewColumn(column);
    return mainRenderRow(column, ...otherArgs);
  };

  render() {
    const {
      columns = List(),
      renderRow: mainRenderRow,
      width: _width,
      ...props
    } = this.props;

    const width = _width || getWidth();
    const initialListSize = Math.max(1, Math.ceil(getFullWidth() / width));

    return (
      <StyledImmutableListViewListView
        immutableData={columns}
        initialListSize={initialListSize}
        renderRow={this.renderRow(mainRenderRow)}
        horizontal
        pagingEnabled
        removeClippedSubviews
        {...props}
      />
    );
  }
}
