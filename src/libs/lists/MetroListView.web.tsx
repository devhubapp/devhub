// From: https://github.com/react-native-web-community/react-native-web-lists
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */
'use strict'

import React from 'react'
import {
  ListView,
  ListViewDataSource,
  ListViewProperties,
  RefreshControl,
  ScrollView,
  ScrollViewStatic,
} from 'react-native'

const invariant = require('fbjs/lib/invariant') // tslint:disable-line

type Item = any
interface SectionItem {
  key: string
  data: Item[]
}

export interface IProps extends ListViewProperties {
  FooterComponent: React.ComponentType
  ItemSeparatorComponent: React.ComponentType // not supported yet
  ListEmptyComponent: React.ComponentType
  ListHeaderComponent: React.ComponentType
  keyExtractor: (item: Item, index: number) => string
  renderItem: (info: { item: Item; index: number }) => React.ReactElement<any>
  renderSectionHeader?: (
    sectionData: any,
    sectionId: string | number,
  ) => React.ReactElement<any>

  // Provide either `items` or `sections`
  items: Item[] // By default, an Item is assumed to be {key: string}
  sections?: SectionItem[]

  /**
   * If provided, a standard RefreshControl will be added for "Pull to Refresh" functionality. Make
   * sure to also set the `refreshing` prop correctly.
   */
  onRefresh?: () => void
  /**
   * Set this true while waiting for new data from a refresh.
   */
  refreshing: boolean
  /**
   * If true, renders items next to each other horizontally instead of stacked vertically.
   */
  horizontal?: boolean | undefined
}

export interface IState {
  ds: ListViewDataSource
  sectionHeaderData: any
}

/**
 * This is just a wrapper around the legacy ListView that matches the new API of FlatList, but with
 * some section support tacked on. It is recommended to just use FlatList directly, this component
 * is mostly for debugging and performance comparison.
 */
export default class MetroListView extends React.Component<IProps, IState> {
  static defaultProps = {
    FooterComponent: () => null,
    ItemSeparatorComponent: () => null,
    ListEmptyComponent: () => null,
    ListHeaderComponent: () => null,
    keyExtractor: (item: Item, index: number) => item.key || String(index),
    renderScrollComponent: (props: IProps) => {
      if (props.onRefresh) {
        return (
          <ScrollView
            {...props}
            refreshControl={
              <RefreshControl
                onRefresh={props.onRefresh}
                refreshing={props.refreshing}
              />
            }
          />
        )
      }

      return <ScrollView {...props} />
    },
  }

  state: IState = this._computeState(this.props, {
    ds: new ListView.DataSource({
      getSectionHeaderData: (_, sectionID) =>
        this.state.sectionHeaderData[sectionID],
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged: () => true,
    }),
    sectionHeaderData: {},
  })

  _listRef:
    | React.Component<ListViewProperties, React.ComponentState> & {
        scrollTo: ScrollViewStatic['scrollTo']
      }
    | null = null

  scrollToEnd(_?: { animated?: boolean | undefined } | undefined) {
    throw new Error('scrollToEnd not supported in legacy ListView.')
  }

  scrollToIndex(_: {
    animated?: boolean | undefined
    index: number
    viewPosition?: number
  }) {
    throw new Error('scrollToIndex not supported in legacy ListView.')
  }

  scrollToItem(_: {
    animated?: boolean | undefined
    item: Item
    viewPosition?: number
  }) {
    throw new Error('scrollToItem not supported in legacy ListView.')
  }

  scrollToLocation(_: {
    animated?: boolean | undefined
    itemIndex: number
    sectionIndex: number
    viewOffset?: number
    viewPosition?: number
  }) {
    throw new Error('scrollToLocation not supported in legacy ListView.')
  }

  scrollToOffset(params: { animated?: boolean | undefined; offset: number }) {
    const { animated, offset } = params

    if (this._listRef) {
      this._listRef.scrollTo(
        this.props.horizontal
          ? { x: offset, animated }
          : { y: offset, animated },
      )
    }
  }

  getListRef() {
    return this._listRef
  }

  // setNativeProps(props: any) {
  //   if (this._listRef) {
  //     this._listRef.setNativeProps(props)
  //   }
  // }

  componentWillReceiveProps(newProps: IProps) {
    this.setState(state => this._computeState(newProps, state))
  }

  render() {
    const {
      FooterComponent,
      ItemSeparatorComponent,
      ListEmptyComponent,
      ListHeaderComponent,
      keyExtractor,
      renderItem,
      sections,
      ...props
    } = this.props

    return (
      <ListView
        enableEmptySections
        renderRow={this._renderRow}
        renderFooter={this._renderFooter}
        renderHeader={
          this.state.ds.getRowCount()
            ? ListHeaderComponent && this._renderHeader
            : ListEmptyComponent && this._renderEmpty
        }
        renderSectionHeader={sections && this._renderSectionHeader}
        renderSeparator={ItemSeparatorComponent && this._renderSeparator}
        {...props}
        dataSource={this.state.ds}
        ref={this._captureRef}
      />
    )
  }

  _captureRef = (
    ref:
      | React.Component<ListViewProperties, React.ComponentState> & {
          scrollTo: ScrollViewStatic['scrollTo']
        }
      | null,
  ) => {
    if (ref) this._listRef = ref
  }

  _computeState(props: IProps, state: IState) {
    const sectionHeaderData: { [key: string]: Item } = {}

    if (props.sections) {
      invariant(!props.items, 'Cannot have both sections and items props.')
      const sections: { [key: string]: SectionItem['data'] } = {}

      props.sections.forEach((sectionIn, ii) => {
        const sectionID = 's' + ii
        sections[sectionID] = sectionIn.data
        sectionHeaderData[sectionID] = sectionIn
      })

      return {
        sectionHeaderData,
        ds: state.ds.cloneWithRowsAndSections(sections),
      }
    }

    invariant(!props.sections, 'Cannot have both sections and items props.')
    return {
      sectionHeaderData,
      ds: state.ds.cloneWithRows(props.items),
    }
  }

  _renderEmpty = () => <this.props.ListEmptyComponent key="$empty" />

  _renderFooter = () => <this.props.FooterComponent key="$footer" />

  _renderHeader = () => <this.props.ListHeaderComponent key="$header" />

  _renderRow = (
    item: Item,
    _: string | number,
    rowID: string | number,
    __?: boolean,
  ) => {
    return this.props.renderItem({ item, index: rowID as number })
  }

  _renderSectionHeader = (section: any, sectionID: string | number) => {
    const { renderSectionHeader } = this.props

    invariant(
      renderSectionHeader,
      'Must provide renderSectionHeader with sections prop',
    )

    return renderSectionHeader!({ section }, sectionID)
  }

  _renderSeparator = (sID: string | number, rID: string | number) => (
    <this.props.ItemSeparatorComponent key={`${sID}` + `${rID}`} />
  )
}
