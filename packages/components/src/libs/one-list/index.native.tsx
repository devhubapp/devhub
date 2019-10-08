import React, { useMemo, useRef } from 'react'
import { FlatList, FlatListProps, View } from 'react-native'

import { sharedStyles } from '../../styles/shared'
import { AutoSizer } from '../auto-sizer'
import { bugsnag } from '../bugsnag'
import { Platform } from '../platform'
import { OneListInstance, OneListProps } from './index.shared'

export { OneListProps }

const renderScrollComponent = Platform.select<
  () => FlatListProps<any>['renderScrollComponent']
>({
  android: () => {
    const GestureHandlerScrollView = require('react-native-gesture-handler')
      .ScrollView
    return (p: any) => <GestureHandlerScrollView {...p} nestedScrollEnabled />
  },
  default: () => undefined,
})()

export const OneList = (React.memo(
  React.forwardRef<OneListInstance, OneListProps<any>>((props, ref) => {
    React.useImperativeHandle(
      ref,
      () => ({
        scrollToStart: ({ animated }: { animated?: boolean } = {}) => {
          try {
            if (!flatListRef.current) return
            flatListRef.current.scrollToOffset({ animated, offset: 0 })
          } catch (error) {
            console.error(error)
            bugsnag.notify(error)
          }
        },
        scrollToEnd: ({ animated }: { animated?: boolean } = {}) => {
          try {
            if (!flatListRef.current) return
            flatListRef.current.scrollToEnd({ animated })
          } catch (error) {
            console.error(error)
            bugsnag.notify(error)
          }
        },
        scrollToIndex: (index, params) => {
          try {
            if (!flatListRef.current) return

            const alignment = params ? params.alignment : 'center'

            // TODO: Implement 'smart' alignment like react-window
            flatListRef.current.scrollToIndex({
              animated: !!(params && params.animated),
              index,
              viewOffset: 0,
              viewPosition:
                alignment === 'start' ? 0 : alignment === 'end' ? 1 : 0.5,
            })
          } catch (error) {
            console.error(error)
            bugsnag.notify(error)
          }
        },
      }),
      [],
    )

    const flatListRef = useRef<FlatList<any>>(null)

    const {
      ListEmptyComponent,
      containerStyle,
      data,
      disableVirtualization,
      estimatedItemSize,
      footer,
      getItemKey,
      getItemSize,
      header,
      horizontal,
      itemSeparator,
      listStyle,
      onVisibleItemsChanged,
      overscanCount = 1,
      pagingEnabled,
      pointerEvents,
      refreshControl,
      renderItem,
      safeAreaInsets,
      snapToAlignment,
    } = props

    const onVisibleItemsChangedRef = useRef(onVisibleItemsChanged)
    onVisibleItemsChangedRef.current = onVisibleItemsChanged

    const getItemLayout = useMemo<
      NonNullable<FlatListProps<any>['getItemLayout']>
    >(() => {
      const lastIndex = data.length - 1

      const itemLayouts = data.reduce<
        Array<ReturnType<NonNullable<FlatListProps<any>['getItemLayout']>>>
      >((result, item, index) => {
        const lastItemLayout = result.slice(-1)[0]
        const lastOffset = (lastItemLayout && lastItemLayout.offset) || 0
        const lastLenght = (lastItemLayout && lastItemLayout.length) || 0

        result.push({
          index,
          length: getItemSize(item, index),
          offset:
            lastOffset +
            lastLenght +
            (index > 0 &&
            index < lastIndex &&
            itemSeparator &&
            itemSeparator.Component &&
            itemSeparator.size
              ? itemSeparator.size
              : 0),
        })

        return result
      }, [])

      return (_, index) => itemLayouts[index]
    }, [data, getItemSize, itemSeparator && itemSeparator.size])

    const keyExtractor: FlatListProps<any>['keyExtractor'] = getItemKey

    const onViewableItemsChanged = useMemo<
      FlatListProps<any>['onViewableItemsChanged']
    >(() => {
      return ({ viewableItems }) => {
        if (!onVisibleItemsChangedRef.current) return undefined

        const visibleIndexes = viewableItems
          .filter(v => v.isViewable && typeof v.index === 'number')
          .map(v => v.index!)

        if (!visibleIndexes.length) onVisibleItemsChangedRef.current(-1, -1)

        onVisibleItemsChangedRef.current(
          Math.min(...visibleIndexes),
          Math.max(...visibleIndexes),
        )
      }
    }, [])

    const contentContainerStyle = useMemo<
      FlatListProps<any>['contentContainerStyle']
    >(() => {
      if (!safeAreaInsets) return undefined

      return {
        paddingTop: safeAreaInsets.top,
        paddingBottom: safeAreaInsets.bottom,
        paddingLeft: safeAreaInsets.left,
        paddingRight: safeAreaInsets.right,
      }
    }, [
      safeAreaInsets && safeAreaInsets.top,
      safeAreaInsets && safeAreaInsets.bottom,
      safeAreaInsets && safeAreaInsets.left,
      safeAreaInsets && safeAreaInsets.right,
    ])

    const viewabilityConfig = useMemo(
      () => ({
        itemVisiblePercentThreshold: 10,
      }),
      [],
    )

    return (
      <View
        pointerEvents={pointerEvents}
        style={[
          sharedStyles.flex,
          sharedStyles.fullWidth,
          sharedStyles.fullHeight,
          containerStyle,
        ]}
      >
        {header &&
        header.size > 0 &&
        header.Component &&
        (header.sticky || !data.length) ? (
          <header.Component />
        ) : null}

        <View
          style={[
            sharedStyles.flex,
            sharedStyles.fullWidth,
            sharedStyles.fullHeight,
          ]}
        >
          {data.length > 0 ? (
            <AutoSizer disableWidth={!horizontal} disableHeight={horizontal}>
              {({ width, height }) =>
                !!(
                  (horizontal && width > 0) ||
                  (!horizontal && height > 0)
                ) && (
                  <FlatList
                    ref={flatListRef}
                    key="flatlist"
                    ListFooterComponent={
                      footer && footer.size > 0 && !footer.sticky
                        ? footer.Component
                        : undefined
                    }
                    ListHeaderComponent={
                      header && header.size > 0 && !header.sticky
                        ? header.Component
                        : undefined
                    }
                    ItemSeparatorComponent={
                      itemSeparator &&
                      itemSeparator.size &&
                      itemSeparator.Component
                        ? ({ leadingItem }) => {
                            const leadingIndex = leadingItem
                              ? data.findIndex(item => item === leadingItem)
                              : -1
                            const trailingIndex =
                              leadingIndex >= 0 &&
                              leadingIndex + 1 < data.length - 1
                                ? leadingIndex + 1
                                : -1

                            return (
                              <>
                                {!!(
                                  itemSeparator &&
                                  itemSeparator.size &&
                                  itemSeparator.Component
                                ) && (
                                  <itemSeparator.Component
                                    leading={
                                      leadingIndex >= 0
                                        ? {
                                            index: leadingIndex,
                                            item: data[leadingIndex],
                                          }
                                        : undefined
                                    }
                                    trailing={
                                      trailingIndex >= 0
                                        ? {
                                            index: trailingIndex,
                                            item: data[trailingIndex],
                                          }
                                        : undefined
                                    }
                                  />
                                )}
                              </>
                            )
                          }
                        : undefined
                    }
                    alwaysBounceHorizontal={false}
                    alwaysBounceVertical={false}
                    contentContainerStyle={contentContainerStyle}
                    data={data}
                    data-paging-enabled-fix={pagingEnabled}
                    disableVirtualization={disableVirtualization}
                    getItemLayout={getItemLayout}
                    horizontal={horizontal}
                    renderScrollComponent={renderScrollComponent}
                    initialNumToRender={
                      1 +
                      Math.ceil(
                        horizontal
                          ? width / estimatedItemSize
                          : height / estimatedItemSize,
                      )
                    }
                    keyExtractor={keyExtractor}
                    maxToRenderPerBatch={2}
                    onScrollToIndexFailed={onScrollToIndexFailed}
                    onViewableItemsChanged={onViewableItemsChanged}
                    pagingEnabled={pagingEnabled}
                    refreshControl={refreshControl}
                    removeClippedSubviews={!disableVirtualization}
                    renderItem={renderItem}
                    scrollEventThrottle={16}
                    snapToAlignment={snapToAlignment}
                    style={[
                      listStyle,
                      {
                        width: horizontal ? width : '100%',
                        height: horizontal ? '100%' : height,
                      },
                    ]}
                    updateCellsBatchingPeriod={0}
                    viewabilityConfig={viewabilityConfig}
                    windowSize={
                      1 +
                      (estimatedItemSize > 0 && overscanCount > 0
                        ? Math.ceil(
                            overscanCount /
                              (horizontal
                                ? width / estimatedItemSize
                                : height / estimatedItemSize),
                          )
                        : 1)
                    }
                  />
                )
              }
            </AutoSizer>
          ) : ListEmptyComponent ? (
            <ListEmptyComponent />
          ) : null}
        </View>

        {footer &&
        footer.size > 0 &&
        footer.Component &&
        (footer.sticky || !data.length) ? (
          <footer.Component />
        ) : null}
      </View>
    )
  }),
) as any) as ((<ItemT>(
  props: OneListProps<ItemT> & React.RefAttributes<OneListInstance>,
) => React.ReactElement) & {
  displayName: string
} & OneListInstance)

OneList.displayName = 'OneList'

const onScrollToIndexFailed: NonNullable<
  FlatListProps<string>['onScrollToIndexFailed']
> = info => {
  console.error(info)
  bugsnag.notify({
    name: 'ScrollToIndexFailed',
    message: 'Failed to scroll to index',
    ...info,
  })
}
