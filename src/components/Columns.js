// @flow

import React from 'react';
import styled from 'styled-components/native';
import ImmutableListView from 'react-native-immutable-list-view';
import { List } from 'immutable';
import { Dimensions } from 'react-native';

import ColumnContainer from '../containers/ColumnContainer';
import NewColumn from './NewColumn';
// import ListView from './lists/ListView';
import { contentPadding, radius } from '../styles/variables';
import type { ActionCreators, Column as ColumnType } from '../utils/types';

export const columnMargin = 2;

const spacing = columnMargin + contentPadding;
const getFullWidth = () => Dimensions.get('window').width;
const getWidth = () => getFullWidth() - (2 * spacing);

const StyledImmutableListViewListView = styled(ImmutableListView)`
  flex: 1;
  overflow: visible;
  background-color: ${({ theme }) => theme.base00};
`;

const ColumnWrapper = styled.View`
  flex: 1;
  align-self: center;
  width: ${getWidth};
`;

const StyledColumnContainer = styled(ColumnContainer)`
  flex: 1;
  margin-horizontal: ${columnMargin};
  margin-vertical: ${columnMargin * 2};
`;

const StyledNewColumn = styled(NewColumn)`
  flex: 1;
  margin-horizontal: ${columnMargin};
  margin-vertical: ${columnMargin * 2};
`;

export default class extends React.PureComponent {
  props: {
    actions: ActionCreators,
    columns: Array<ColumnType>,
  };

  renderRow = (column) => {
    if (!column) return null;

    const columnId = column.get('id');
    if (!columnId) return null;

    return (
      <ColumnWrapper key={`column-${columnId}`}>
        <StyledColumnContainer
          columnId={columnId}
          radius={radius}
        />
      </ColumnWrapper>
    );
  };

  render() {
    const { actions, columns = List(), ...props } = this.props;

    if (!(columns.size > 0)) {
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
        renderRow={this.renderRow}
        width={getWidth()}
        contentContainerStyle={{ marginHorizontal: spacing }}
        horizontal
        pagingEnabled
        {...props}
      />
    );
  }
}
