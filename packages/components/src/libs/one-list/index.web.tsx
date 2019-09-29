import { VariableSizeList as VariableSizeListWithoutVirtualization } from '@brunolemos/react-window-without-virtualization'
import React, {
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Dimensions, InteractionManager, View } from 'react-native'
import {
  ListChildComponentProps,
  VariableSizeList,
  VariableSizeListProps,
} from 'react-window'

import { useDynamicRef } from '../../hooks/use-dynamic-ref'
import { usePrevious } from '../../hooks/use-previous'
import { sharedStyles } from '../../styles/shared'
import { AutoSizer } from '../auto-sizer'
import { bugsnag } from '../bugsnag'
import { OneListInstance, OneListProps } from './index.shared'

export { OneListProps }

const defaultSafeAreaInsets: OneListProps<any>['safeAreaInsets'] = {
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
}
export const OneListSafeAreaContext = React.createContext(defaultSafeAreaInsets)

const ItemRow = React.memo(
  (props: {
    index: number
    item: any
    itemKey: string
    renderItem: OneListProps<any>['renderItem']
  }) => {
    const { index, item, itemKey, renderItem } = props
    return <Fragment key={itemKey}>{renderItem({ index, item })}</Fragment>
  },
)

interface ItemData {
  data: any[]
  footer?: OneListProps<any>['footer']
  getItemKey?: OneListProps<any>['getItemKey']
  header?: OneListProps<any>['header']
  innerFooterSize: number
  innerHeaderSize: number
  itemCount: number
  itemSeparator?: OneListProps<any>['itemSeparator']
  pagingEnabled: OneListProps<any>['pagingEnabled']
  renderItem: OneListProps<any>['renderItem']
  snapToAlignment: OneListProps<any>['snapToAlignment']
}

const Row = React.memo(
  React.forwardRef<any, ListChildComponentProps>((props, rowRef) => {
    const { index, style: _style } = props

    const {
      data,
      footer,
      getItemKey,
      header,
      innerFooterSize,
      innerHeaderSize,
      itemCount,
      itemSeparator,
      pagingEnabled,
      renderItem,
      snapToAlignment,
    } = props.data as ItemData

    const safeAreaInsets = useContext(OneListSafeAreaContext)

    const style = {
      ..._style,
      ...(pagingEnabled
        ? { scrollSnapAlign: snapToAlignment || 'start' }
        : undefined),
      top:
        typeof safeAreaInsets.top === 'number'
          ? `${parseFloat(`${_style.top || 0}`) + safeAreaInsets.top}px`
          : _style.top,
      left:
        typeof safeAreaInsets.left === 'number'
          ? `${parseFloat(`${_style.left || 0}`) + safeAreaInsets.left}px`
          : _style.left,
    }

    if (innerHeaderSize && index === 0 && header) {
      return (
        <div
          ref={rowRef}
          key={`react-window-header-${header.Component.displayName}`}
          style={style}
        >
          <header.Component />
        </div>
      )
    }

    if (innerFooterSize && index === itemCount - 1 && footer) {
      return (
        <div ref={rowRef} style={style}>
          <footer.Component />
        </div>
      )
    }

    const dataIndex = innerHeaderSize ? index - 1 : index
    if (!(dataIndex >= 0 && dataIndex <= data.length - 1)) return null

    return (
      <div ref={rowRef} style={style}>
        <View style={[sharedStyles.fullWidth, sharedStyles.fullHeight]}>
          <ItemRow
            index={dataIndex}
            item={data[dataIndex]}
            itemKey={
              getItemKey
                ? getItemKey(data[dataIndex], dataIndex)
                : `react-window-item-row-${dataIndex}`
            }
            renderItem={renderItem}
          />

          {!!(
            dataIndex >= 0 &&
            dataIndex < data.length - 1 &&
            itemSeparator &&
            itemSeparator.size > 0 &&
            itemSeparator.Component
          ) && (
            <itemSeparator.Component
              leading={{ index, item: data[dataIndex] }}
              trailing={
                dataIndex + 1 < data.length - 1
                  ? { index: dataIndex + 1, item: data[dataIndex + 1] }
                  : undefined
              }
            />
          )}
        </View>
      </div>
    )
  }),
)

const innerElementType = React.forwardRef<
  any,
  {
    [key: string]: any
    style: { width?: string | number; height?: string | number }
  }
>((props, ref) => {
  const { style: _style, ...otherProps } = props

  const safeAreaInsets = useContext(OneListSafeAreaContext)

  const style = {
    ..._style,
    width:
      (typeof safeAreaInsets.left === 'number' && safeAreaInsets.left !== 0) ||
      (typeof safeAreaInsets.right === 'number' &&
        safeAreaInsets.right !== 0 &&
        (!_style.width || typeof _style.width !== 'string'))
        ? `${parseFloat(`${_style.width || 0}`) +
            (safeAreaInsets.left || 0) +
            (safeAreaInsets.right || 0)}px`
        : _style.width,
    height:
      (typeof safeAreaInsets.top === 'number' && safeAreaInsets.top !== 0) ||
      (typeof safeAreaInsets.bottom === 'number' &&
        safeAreaInsets.bottom !== 0 &&
        (!_style.height || typeof _style.height !== 'string'))
        ? `${parseFloat(`${_style.height || 0}`) +
            (safeAreaInsets.top || 0) +
            (safeAreaInsets.bottom || 0)}px`
        : _style.height,
  }

  return <div ref={ref} style={style} {...otherProps} />
})

export const OneList = (React.memo(
  React.forwardRef<OneListInstance, OneListProps<any>>((props, ref) => {
    const {
      ListEmptyComponent,
      containerStyle,
      data,
      estimatedItemSize,
      footer,
      getItemKey,
      getItemSize,
      header,
      horizontal,
      itemSeparator,
      listStyle,
      onVisibleItemsChanged,
      overscanCount,
      pagingEnabled,
      pointerEvents,
      // refreshControl, // TODO
      renderItem,
      safeAreaInsets,
      snapToAlignment,
    } = props

    React.useImperativeHandle(
      ref,
      () => ({
        scrollToStart: () => {
          try {
            if (!variableSizeListRef.current) return
            variableSizeListRef.current.scrollTo(0)
          } catch (error) {
            console.error(error)
            bugsnag.notify(error)
          }
        },
        scrollToEnd: () => {
          try {
            if (!variableSizeListRef.current) return
            variableSizeListRef.current.scrollToItem(data.length - 1, 'start')
          } catch (error) {
            console.error(error)
            bugsnag.notify(error)
          }
        },
        scrollToIndex: (index, params) => {
          try {
            const alignment = params ? params.alignment : 'smart'
            if (!variableSizeListRef.current) return
            variableSizeListRef.current.scrollToItem(index, alignment)
          } catch (error) {
            console.error(error)
            bugsnag.notify(error)
          }
        },
      }),
      [data.length],
    )

    const variableSizeListRef = useRef<VariableSizeList>(null)
    const variableSizeListInnerRef = useRef<
      React.HTMLAttributes<React.ReactHTMLElement<HTMLDivElement>>
    >(null)

    const [isInitialRender, setIsInitialRender] = useState(true)

    useEffect(() => {
      InteractionManager.runAfterInteractions(() => {
        setIsInitialRender(false)
      })
    }, [])

    const List = props.disableVirtualization
      ? VariableSizeListWithoutVirtualization
      : VariableSizeList

    const itemSeparatorSize =
      itemSeparator && itemSeparator.Component && itemSeparator.size > 0
        ? itemSeparator.size
        : 0

    const innerHeaderSize =
      header && header.Component && !header.sticky && header.size > 0
        ? header.size
        : 0

    const innerFooterSize =
      footer && footer.Component && !footer.sticky && footer.size > 0
        ? footer.size
        : 0

    const _itemCount =
      data.length + (innerHeaderSize ? 1 : 0) + (innerFooterSize ? 1 : 0)
    let itemCount = _itemCount

    if (isInitialRender) {
      const totalScreenSize = horizontal
        ? Dimensions.get('window').width
        : Dimensions.get('window').height

      let initialNumToRender = 0
      let totalRenderedSize = 0
      data.every((item, index) => {
        const size = getItemSize(item, index)
        totalRenderedSize = totalRenderedSize + size
        initialNumToRender = initialNumToRender + 1

        return totalRenderedSize < totalScreenSize
      })

      itemCount = Math.min(
        initialNumToRender +
          (innerHeaderSize ? 1 : 0) +
          (innerFooterSize ? 1 : 0),
        _itemCount,
      )
    }

    const itemCountRef = useDynamicRef(itemCount)
    const itemKey = useCallback<NonNullable<VariableSizeListProps['itemKey']>>(
      (index, _itemData: ItemData) => {
        if (innerHeaderSize && index === 0) return 'header'
        if (innerFooterSize && index === itemCountRef.current - 1)
          return 'footer'

        const dataIndex = innerHeaderSize ? index - 1 : index
        return getItemKey(_itemData.data[dataIndex], dataIndex)
      },
      [getItemKey, innerHeaderSize, innerFooterSize],
    )

    const itemSize = useMemo<VariableSizeListProps['itemSize']>(() => {
      return index => {
        if (innerHeaderSize && index === 0) return innerHeaderSize
        if (innerFooterSize && index === itemCount - 1) return innerFooterSize

        const dataIndex = innerHeaderSize ? index - 1 : index
        if (!(dataIndex >= 0 && dataIndex <= data.length - 1)) return 0

        return (
          getItemSize(data[dataIndex], dataIndex) +
          (dataIndex >= 0 && dataIndex < data.length - 1
            ? itemSeparatorSize
            : 0)
        )
      }
    }, [
      data,
      getItemSize,
      innerFooterSize,
      innerHeaderSize,
      itemCount,
      itemSeparatorSize,
    ])

    const onItemsRendered = useMemo<
      VariableSizeListProps['onItemsRendered']
    >(() => {
      if (!onVisibleItemsChanged) return undefined

      return ({ visibleStartIndex, visibleStopIndex }) => {
        return onVisibleItemsChanged(visibleStartIndex, visibleStopIndex)
      }
    }, [onVisibleItemsChanged])

    const previousItemCount = usePrevious(itemCount)
    const previousItemSize = usePrevious(itemSize)
    useLayoutEffect(() => {
      if (!variableSizeListRef.current) return
      if (!(itemSize && previousItemSize)) return

      const previousSizes = new Array(previousItemCount)
        .fill(true)
        .map((_, index) => previousItemSize(index))
      const newSizes = new Array(itemCount)
        .fill(true)
        .map((_, index) => itemSize(index))

      let firstDifferentIndex = newSizes.findIndex(
        (size, index) => size !== previousSizes[index],
      )

      if (
        !(firstDifferentIndex >= 0) &&
        previousSizes.length !== newSizes.length
      ) {
        firstDifferentIndex = Math.min(
          previousSizes.length - 1,
          newSizes.length - 1,
        )
      }

      if (firstDifferentIndex >= 0) {
        variableSizeListRef.current.resetAfterIndex(firstDifferentIndex, true)
      }
    }, [itemCount, itemSize, previousItemCount, previousItemSize])

    const style = useMemo<VariableSizeListProps['style']>(
      () => ({
        ...(pagingEnabled
          ? { scrollSnapType: horizontal ? 'x mandatory' : 'y mandatory' }
          : {}),
        ...(horizontal
          ? {
              overscrollBehaviorX: 'contain',
            }
          : {
              overscrollBehaviorY: 'contain',
            }),
      }),
      [horizontal, listStyle, pagingEnabled],
    )

    const itemData = useMemo<ItemData>(
      () => ({
        data,
        footer,
        getItemKey,
        header,
        innerFooterSize,
        innerHeaderSize,
        itemCount,
        itemSeparator,
        pagingEnabled,
        renderItem,
        snapToAlignment,
      }),
      [
        data,
        footer,
        getItemKey,
        header,
        innerFooterSize,
        innerHeaderSize,
        itemCount,
        itemSeparator,
        pagingEnabled,
        renderItem,
        snapToAlignment,
      ],
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
            listStyle,
          ]}
        >
          {data.length > 0 ? (
            <AutoSizer disableWidth={!horizontal} disableHeight={horizontal}>
              {({ width, height }) =>
                !!(
                  (horizontal && width > 0) ||
                  (!horizontal && height > 0)
                ) && (
                  <OneListSafeAreaContext.Provider
                    value={safeAreaInsets || defaultSafeAreaInsets}
                  >
                    <List
                      ref={variableSizeListRef}
                      innerRef={variableSizeListInnerRef}
                      key="variable-size-list"
                      estimatedItemSize={estimatedItemSize}
                      height={horizontal ? '100%' : height}
                      innerElementType={innerElementType}
                      itemCount={itemCount}
                      itemData={itemData}
                      itemKey={itemKey}
                      itemSize={itemSize}
                      layout={horizontal ? 'horizontal' : 'vertical'}
                      onItemsRendered={onItemsRendered}
                      overscanCount={overscanCount}
                      width={horizontal ? width : '100%'}
                      style={style}
                    >
                      {Row}
                    </List>
                  </OneListSafeAreaContext.Provider>
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
