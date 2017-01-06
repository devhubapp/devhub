// @flow

import React from 'react';
import styled from 'styled-components/native';
import ImmutableListView from 'react-native-immutable-list-view';
import withOrientation from '../../hoc/withOrientation';
import { List } from 'immutable';
import { Platform, View } from 'react-native';

import NewColumn from './NewColumn';
import { getFullWidth, getWidth } from './_Column';
import type { ActionCreators } from '../../utils/types';

export const StyledImmutableListViewListView = styled(ImmutableListView)`
  flex: 1;
  ${
    Platform.select({
      ios: {
        overflow: 'hidden',
      },
    })
  }
`;

@withOrientation
export default class extends React.PureComponent {
  props: {
    actions: ActionCreators,
    addColumnFn?: ?Function,
    columns: Array<any>,
    renderRow: Function,
    width?: number,
  };

  render() {
    const {
      actions,
      addColumnFn,
      columns = List(),
      renderRow,
      width: _width,
      ...props
    } = this.props;

    if (!(columns.size > 0) && addColumnFn) {
      return (
        <NewColumn
          addColumnFn={addColumnFn}
          actions={actions}
        />
      );
    }

    const width = _width || getWidth();
    const initialListSize = Math.max(1, Math.ceil(getFullWidth() / width));

    return (
      <StyledImmutableListViewListView
        key="columns-list-view"
        immutableData={columns}
        initialListSize={initialListSize}
        renderRow={renderRow}
        removeClippedSubviews={false}
        horizontal
        {...(Platform.OS === 'ios' ? {
          decelerationRate: 0,
          pagingEnabled: false,
          snapToInterval: width,
          snapToAlignment: 'start',
          contentContainerStyle: {
            overflow: 'hidden',
            paddingHorizontal: (getFullWidth() - width) / 2,
          },
        } : {
          pagingEnabled: true,
          contentContainerStyle: {
            overflow: 'hidden',
          },
          style: {
            marginHorizontal: (getFullWidth() - width) / 2,
          },
        })}
        {...props}
      />
    );
  }
}
