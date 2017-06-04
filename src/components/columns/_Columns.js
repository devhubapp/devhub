// @flow

import React from 'react'
import styled from 'styled-components/native'
import { Dimensions } from 'react-native'
import { List } from 'immutable'

import NewColumn from './NewColumn'
import ImmutableVirtualizedList from '../../libs/immutable-virtualized-list'
import withOrientation from '../../hoc/withOrientation'
import { getColumnWidth, getColumnContentWidth } from './_Column'
import type { ActionCreators } from '../../utils/types'

export const StyledImmutableVirtualizedListListView = styled(
  ImmutableVirtualizedList,
)`
  flex: 1;
`

@withOrientation
export default class Columns extends React.PureComponent {
  props: {
    actions: ActionCreators,
    addColumnFn?: ?Function,
    columns: Array<any>,
    radius?: number,
    renderItem: Function,
    width?: number,
  }

  makeRenderItem = mainRenderItem => (
    { index, item: column },
    ...otherArgs
  ) => {
    if (!column) return null

    if (column.get('id') === 'new') return this.renderNewColumn(column)
    return mainRenderItem({ index, item: column }, ...otherArgs)
  }

  renderNewColumn(column) {
    const { actions, addColumnFn, radius, width } = this.props

    if (!addColumnFn) return null

    const _addColumnFn = column
      ? addColumnFn.bind(this, { order: column.get('order') })
      : addColumnFn

    return (
      <NewColumn
        addColumnFn={_addColumnFn}
        actions={actions}
        radius={radius}
        width={width || getColumnContentWidth()}
      />
    )
  }

  render() {
    const {
      columns = List(),
      renderItem: mainRenderItem,
      ...props
    } = this.props

    const initialNumToRender = Math.max(
      1,
      Math.ceil(Dimensions.get('window').width / getColumnWidth()),
    )

    return (
      <StyledImmutableVirtualizedListListView
        immutableData={columns}
        initialNumToRender={initialNumToRender}
        renderItem={this.makeRenderItem(mainRenderItem)}
        removeClippedSubviews
        horizontal
        pagingEnabled
        {...props}
      />
    )
  }
}
