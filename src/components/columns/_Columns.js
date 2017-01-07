// @flow

import React from 'react';
import styled from 'styled-components/native';
import ImmutableListView from 'react-native-immutable-list-view';
import withOrientation from '../../hoc/withOrientation';
import { List, Map } from 'immutable';
import { Platform } from 'react-native';

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
    radius?: number,
    renderRow: Function,
    width?: number,
  };

  renderNewColumn(column) {
    const { actions, addColumnFn, radius, width } = this.props;

    if (!addColumnFn) return null;

    const _addColumnFn = column
      ? addColumnFn.bind(this, { order: column.get('order') })
      : addColumnFn
    ;

    return (
      <NewColumn
        addColumnFn={_addColumnFn}
        actions={actions}
        radius={radius}
        width={width || getWidth()}
      />
    );
  }

  renderRow = (mainRenderRow) => (column, ...otherArgs) => {
    if (!column) return null;

    if (column.get('id') === 'new') return this.renderNewColumn(column);
    return mainRenderRow(column, ...otherArgs);
  }

  render() {
    const {
      columns: _columns,
      renderRow: mainRenderRow,
      width: _width,
      ...props
    } = this.props;

    const width = _width || getWidth();
    const initialListSize = Math.max(1, Math.ceil(getFullWidth() / width));

    let columns = _columns ? _columns.toList() : List();

    // if (columns.first().get('id') !== 'new') {
    //   columns = columns.insert(0, Map({ id: 'new', order: 0 }));
    // }

    if (columns.size === 0 || columns.last().get('id') !== 'new') {
      columns = columns.push(Map({ id: 'new', order: columns.size }));
    }

    return (
      <StyledImmutableListViewListView
        key="columns-list-view"
        immutableData={columns}
        initialListSize={initialListSize}
        renderRow={this.renderRow(mainRenderRow)}
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
