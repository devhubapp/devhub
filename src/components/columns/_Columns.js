// @flow

import React from 'react'
import styled from 'styled-components/native'
import { Dimensions } from 'react-native'
import { memoize } from 'lodash'

import NewColumn from './NewColumn'
import ImmutableVirtualizedList from '../../libs/immutable-virtualized-list'
import { getColumnWidth, getColumnContentWidth } from './_Column'
import type { ActionCreators } from '../../utils/types'

export const StyledImmutableVirtualizedListListView = styled(
  ImmutableVirtualizedList,
)`
  flex: 1;
`

export default class Columns extends React.PureComponent {
  props: {
    actions: ActionCreators,
    addColumnFn?: ?Function,
    columnIds: Array<string>,
    radius?: number,
    renderItem: Function,
    width?: number,
  }

  makeRenderItem = memoize(
    mainRenderItem => ({ index, item: columnId }, ...otherArgs) => {
      if (!columnId) return null

      if (columnId === 'new') return this.renderNewColumn()
      return mainRenderItem({ index, item: columnId }, ...otherArgs)
    },
  )

  renderNewColumn() {
    const { actions, addColumnFn, radius, width } = this.props

    if (!addColumnFn) return null

    return (
      <NewColumn
        addColumnFn={addColumnFn}
        actions={actions}
        radius={radius}
        width={width || getColumnContentWidth()}
      />
    )
  }

  render() {
    const { columnIds, renderItem: mainRenderItem, ...props } = this.props

    const initialNumToRender = Math.max(
      1,
      Math.ceil(Dimensions.get('window').width / getColumnWidth()),
    )

    return (
      <StyledImmutableVirtualizedListListView
        immutableData={columnIds}
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
