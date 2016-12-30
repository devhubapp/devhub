// @flow

import React from 'react';
import styled from 'styled-components/native';
import ImmutableListView from 'react-native-immutable-list-view';
import { List } from 'immutable';
import { Platform } from 'react-native';

import NewColumn from './NewColumn';
import { getWidth, columnPreviewWidth } from './_Column';
import type { ActionCreators } from '../../utils/types';

export const StyledImmutableListViewListView = styled(ImmutableListView)`
  flex: 1;
  overflow: hidden;
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
        />
      );
    }

    return (
      <StyledImmutableListViewListView
        key="columns-list-view"
        immutableData={columns}
        initialListSize={1}
        rowsDuringInteraction={1}
        renderRow={renderRow}
        horizontal
        removeClippedSubviews
        {...(Platform.OS === 'ios' ? {
          pagingEnabled: false,
          snapToInterval: getWidth(),
          snapToAlignment: 'start',
          contentContainerStyle: {
            overflow: 'hidden',
            paddingHorizontal: columnPreviewWidth,
          },
        } : {
          pagingEnabled: true,
          contentContainerStyle: {
            overflow: 'hidden',
          },
          style: {
            marginHorizontal: columnPreviewWidth,
          },
        })}
        {...props}
      />
    );
  }
}
