// @flow

import React from 'react';
import styled from 'styled-components/native';
import ImmutableListView from 'react-native-immutable-list-view';
import { List } from 'immutable';
import { Dimensions } from 'react-native';

import NewColumn from './NewColumn';
import { contentPadding, radius } from '../../styles/variables';
import type { ActionCreators } from '../../utils/types';

export const columnMargin = 2;
export const spacing = columnMargin + contentPadding;
export const getFullWidth = () => Dimensions.get('window').width;
export const getWidth = () => getFullWidth() - (2 * spacing);

export const StyledImmutableListViewListView = styled(ImmutableListView)`
  flex: 1;
  overflow: visible;
  background-color: ${({ theme }) => theme.base00};
`;

export const ColumnWrapper = styled.View`
  flex: 1;
  align-self: center;
  width: ${getWidth};
`;

export const StyledNewColumn = styled(NewColumn)`
  flex: 1;
  margin-horizontal: ${columnMargin};
  margin-vertical: ${columnMargin * 2};
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

    if (columns.size <= 0 && addColumnFn) {
      return (
        <ColumnWrapper>
          <StyledNewColumn
            actions={actions}
            radius={radius}
          />
        </ColumnWrapper>
      );
    }

    return (
      <StyledImmutableListViewListView
        key="columns-list-view"
        immutableData={columns}
        initialListSize={1}
        rowsDuringInteraction={1}
        renderRow={renderRow}
        width={getWidth()}
        contentContainerStyle={{ marginHorizontal: spacing }}
        horizontal
        pagingEnabled
        {...props}
      />
    );
  }
}
