// @flow

import React, { PureComponent } from 'react'
import VirtualizedList from 'react-native/Libraries/Lists/VirtualizedList'

import OptimizedListItem from './OptimizedListItem'

export default class OptimizedVirtualizedList extends PureComponent {
  state = {}
  rowRefs = []

  _addRowRefs = (ref, data) => {
    this.rowRefs[data.index] = {
      ref,
      item: data.item,
      index: data.index,
    }
  }

  _updateItem = (index, visibility) => {
    const ref = this.rowRefs[index] && this.rowRefs[index].ref
    if (!ref) return null

    ref.setVisibility(visibility)
    return visibility
  }

  _onViewableItemsChanged = (
    info: {
      changed: Array<{
        key: string,
        isViewable: boolean,
        item: any,
        index: ?number,
        section?: any,
      }>,
    },
    ...args
  ) => {
    // there is a bug the it hides everything everytime,
    // blinking components and crashing
    if (!(info && info.viewableItems.length > 0)) return

    info.changed.map(item => this._updateItem(item.index, item.isViewable))

    if (this.props.onViewableItemsChanged)
      this.props.onViewableItemsChanged(info, ...args)
  }

  props: {
    onViewableItemsChanged?: Function,
    renderItem: Function,
  }

  _renderItem = (data, ...args) => {
    const viewComponent = this.props.renderItem(data, ...args)

    return (
      <OptimizedListItem
        ref={ref => this._addRowRefs(ref, data)}
        viewComponent={viewComponent}
      />
    )
  }

  render() {
    return (
      <VirtualizedList
        {...this.props}
        renderItem={this._renderItem}
        onViewableItemsChanged={this._onViewableItemsChanged}
      />
    )
  }
}
