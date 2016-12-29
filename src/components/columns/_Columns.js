// @flow

import React from 'react';
import styled from 'styled-components/native';
import ImmutableListView from 'react-native-immutable-list-view';
import { List } from 'immutable';

import NewColumn from './NewColumn';
import { getWidth, spacing } from './_Column';
import { radius } from '../../styles/variables';
import type { ActionCreators } from '../../utils/types';

export const StyledImmutableListViewListView = styled(ImmutableListView)`
  flex: 1;
  overflow: visible;
  marginHorizontal: ${spacing};
`;

export default class extends React.PureComponent {
  props: {
    actions: ActionCreators,
    addColumnFn?: ?Function,
    columns: Array<any>,
    renderRow: Function,
  };

  render() {
    const { actions, addColumnFn, columns = List(), renderRow, ...props } = this.props;

    if (!(columns.size > 0) && addColumnFn) {
      return (
        <NewColumn
          addColumnFn={addColumnFn}
          actions={actions}
          radius={radius}
        />
      );
    }

    return (
      <StyledImmutableListViewListView
        key="columns-list-view"
        width={getWidth()}
        immutableData={columns}
        initialListSize={1}
        rowsDuringInteraction={1}
        renderRow={renderRow}
        contentContainerStyle={{ overflow: 'hidden' }}
        horizontal
        pagingEnabled
        removeClippedSubviews
        {...props}
      />
    );
  }
}
