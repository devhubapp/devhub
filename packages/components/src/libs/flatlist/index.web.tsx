import React, { Fragment } from 'react'
import { ScrollView, View } from 'react-native'
import AutoSizer from 'react-virtualized-auto-sizer'
import { DynamicSizeList, VariableSizeList } from 'react-window'

import { sharedStyles } from '../../styles/shared'
import { CrossPlatformFlatList, CrossPlatformFlatListProps } from './types'

const separatorsFakeProp = {
  highlight: () => undefined,
  unhighlight: () => undefined,
  updateProps: () => undefined,
}

export interface FlatListProps<ItemT>
  extends CrossPlatformFlatListProps<ItemT> {
  keyExtractor: (item: ItemT, index: number) => string
}

export class FlatList<ItemT> extends React.Component<FlatListProps<ItemT>>
  implements CrossPlatformFlatList<ItemT> {
  static displayName = 'FlatList (react-window)'

  getItemCountConsideringHeaderAndFooter = () => {
    return (
      (this.props.data || []).length +
      (this.props.ListHeaderComponent ? 1 : 0) +
      (this.props.ListFooterComponent ? 1 : 0)
    )
  }

  getDataIndexConsideringHeader = (index: number) => {
    return index - (this.props.ListHeaderComponent ? 1 : 0)
  }

  // tslint:disable member-ordering
  getItemKey = (index: number) => {
    if (index === 0 && this.props.ListHeaderComponent)
      return 'list-header-component'

    if (
      index === this.getItemCountConsideringHeaderAndFooter() - 1 &&
      this.props.ListFooterComponent
    )
      return 'list-footer-component'

    const dataIndex = this.getDataIndexConsideringHeader(index)

    return this.props.keyExtractor(this.props.data![dataIndex], dataIndex)
  }

  Row = React.forwardRef<any, { index: number; style?: any }>((row, ref) => {
    const ListHeaderComponent = this.props.ListHeaderComponent as any
    const ListFooterComponent = this.props.ListFooterComponent as any

    if (row.index === 0 && ListHeaderComponent) {
      return (
        <div ref={ref} style={row.style}>
          <View>
            <ListHeaderComponent />
          </View>
        </div>
      )
    }

    if (
      row.index === this.getItemCountConsideringHeaderAndFooter() - 1 &&
      ListFooterComponent
    ) {
      return (
        <div ref={ref} style={row.style}>
          <View>
            <ListFooterComponent />
          </View>
        </div>
      )
    }

    const dataIndex = this.getDataIndexConsideringHeader(row.index)

    const { data, renderItem: Item } = this.props
    const ItemSeparatorComponent = this.props.ItemSeparatorComponent as any

    return (
      <div ref={ref} style={row.style}>
        <Item
          item={data![dataIndex]}
          index={dataIndex}
          separators={separatorsFakeProp}
        />

        {dataIndex < data!.length - 1 && ItemSeparatorComponent && (
          <ItemSeparatorComponent
            leadingItem={dataIndex >= 0 ? data![dataIndex] : undefined}
          />
        )}
      </div>
    )
  })

  renderNormalScrollView = () => (
    <AutoSizer>
      {({ width, height }) => {
        const { contentContainerStyle, style, data, horizontal } = this.props
        const ListHeaderComponent = this.props.ListHeaderComponent as any
        const ListEmptyComponent = this.props.ListEmptyComponent as any
        const ListFooterComponent = this.props.ListFooterComponent as any

        if (!(data && data.length)) {
          return (
            <View
              style={[horizontal && sharedStyles.horizontal, { width, height }]}
            >
              {!!ListHeaderComponent && (
                <View>
                  <ListHeaderComponent />
                </View>
              )}
              {!!ListEmptyComponent && <ListEmptyComponent />}
              {!!ListFooterComponent && (
                <View>
                  <ListFooterComponent />
                </View>
              )}
            </View>
          )
        }

        return (
          <ScrollView
            contentContainerStyle={contentContainerStyle}
            horizontal={horizontal}
            style={[{ width, height }, style]}
          >
            <>
              {!!ListHeaderComponent && (
                <View>
                  <ListHeaderComponent />
                </View>
              )}

              {data.map((_item, index) => (
                <Fragment
                  key={this.getItemKey(index + (ListHeaderComponent ? 1 : 0))}
                >
                  <this.Row index={index} />
                </Fragment>
              ))}

              {!!ListFooterComponent && (
                <View>
                  <ListFooterComponent />
                </View>
              )}
            </>
          </ScrollView>
        )
      }}
    </AutoSizer>
  )

  renderVariableSizeList = () => (
    <AutoSizer>
      {({ width, height }) => {
        const { data, horizontal } = this.props
        const ListHeaderComponent = this.props.ListHeaderComponent as any
        const ListEmptyComponent = this.props.ListEmptyComponent as any
        const ListFooterComponent = this.props.ListFooterComponent as any

        if (!(data && data.length)) {
          return (
            <View
              style={[horizontal && sharedStyles.horizontal, { width, height }]}
            >
              {!!ListHeaderComponent && (
                <View>
                  <ListHeaderComponent />
                </View>
              )}
              {!!ListEmptyComponent && <ListEmptyComponent />}
              {!!ListFooterComponent && (
                <View>
                  <ListFooterComponent />
                </View>
              )}
            </View>
          )
        }

        return (
          <VariableSizeList
            data-force-rerender={this.props.extraData}
            height={height}
            itemCount={this.getItemCountConsideringHeaderAndFooter()}
            itemKey={this.getItemKey}
            itemSize={this.itemSize}
            layout={horizontal ? 'horizontal' : 'vertical'}
            width={width}
          >
            {this.Row}
          </VariableSizeList>
        )
      }}
    </AutoSizer>
  )

  renderDynamicSizeList = () => (
    <AutoSizer>
      {({ width, height }) => {
        const { data, horizontal } = this.props
        const ListHeaderComponent = this.props.ListHeaderComponent as any
        const ListEmptyComponent = this.props.ListEmptyComponent as any
        const ListFooterComponent = this.props.ListFooterComponent as any

        if (!(data && data.length)) {
          return (
            <View
              style={[horizontal && sharedStyles.horizontal, { width, height }]}
            >
              {!!ListHeaderComponent && (
                <View>
                  <ListHeaderComponent />
                </View>
              )}
              {!!ListEmptyComponent && <ListEmptyComponent />}
              {!!ListFooterComponent && (
                <View>
                  <ListFooterComponent />
                </View>
              )}
            </View>
          )
        }

        return (
          <DynamicSizeList
            data-force-rerender={this.props.extraData}
            height={height}
            itemCount={this.getItemCountConsideringHeaderAndFooter()}
            itemKey={this.getItemKey}
            layout={this.props.horizontal ? 'horizontal' : 'vertical'}
            overscanCount={
              this.props.disableVirtualization ||
              this.props.removeClippedSubviews === false
                ? 9999
                : 2
            }
            width={width}
          >
            {this.Row}
          </DynamicSizeList>
        )
      }}
    </AutoSizer>
  )

  itemSize = (index: number) => {
    return this.props.getItemLayout!(this.props.data! as ItemT[], index).length
  }

  scrollToItem = (_params: {
    animated?: boolean
    item: ItemT
    viewPosition?: number
  }) => {
    // TODO
    if (__DEV__) {
      // tslint:disable-next-line no-console
      console.warn('[react-window] scrollToItem not implemented.')
    }
  }

  render() {
    const {
      contentContainerStyle,
      getItemLayout,
      pointerEvents,
      style,
    } = this.props

    return (
      <View style={[sharedStyles.flex, style]} pointerEvents={pointerEvents}>
        <View style={[sharedStyles.flex, contentContainerStyle]}>
          {this.props.disableVirtualization ||
          this.props.removeClippedSubviews === false
            ? this.renderNormalScrollView()
            : getItemLayout
            ? this.renderVariableSizeList()
            : this.renderDynamicSizeList()}
        </View>
      </View>
    )
  }
}
