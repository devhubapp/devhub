import React, { useEffect, useRef } from 'react'
import {
  FlatList,
  FlatListProps,
  NativeScrollEvent,
  NativeSyntheticEvent,
  SafeAreaView,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native'

import { Omit } from '@devhub/core'
import { ColumnContainer } from '../../containers/ColumnContainer'
import { useEmitter } from '../../hooks/use-emitter'
import { bugsnag } from '../../libs/bugsnag'
import { columnHeaderHeight, contentPadding } from '../../styles/variables'
import { separatorTickSize } from '../common/Separator'
import { AnimatedTransparentTextOverlay } from '../common/TransparentTextOverlay'
import { useColumnWidth } from '../context/ColumnWidthContext'
import { useAppLayout } from '../context/LayoutContext'

export interface ColumnsProps
  extends Omit<FlatListProps<string>, 'data' | 'renderItem'> {
  contentContainerStyle?: StyleProp<ViewStyle>
  columnIds: string[]
  style?: StyleProp<ViewStyle>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  flatlist: {
    flex: 1,
  },
})

function keyExtractor(columnId: string) {
  return `column-container-${columnId}`
}

export const Columns = React.memo((props: ColumnsProps) => {
  const { columnIds, style, ...otherProps } = props

  const { appOrientation, sizename } = useAppLayout()
  const columnWidth = useColumnWidth()

  const flatListRef = useRef<FlatList<string>>(null)
  const leftOverlayRef = useRef<View>(null)
  const rightOverlayRef = useRef<View>(null)
  const isLeftOverlayVisible = useRef(true)
  const isRightOverlayVisible = useRef(true)
  const isShowingBorderRef = useRef(false)
  const isScrollAtTheStartRef = useRef(true)
  const isScrollAtTheEndRef = useRef(false)

  const showHorizontalGradientOverlays =
    sizename >= '3-large' && appOrientation === 'landscape'

  function updateOverlayVisibility() {
    const shouldShowLeftOverlay =
      showHorizontalGradientOverlays &&
      !isShowingBorderRef.current &&
      !isScrollAtTheStartRef.current

    const shouldShowRightOverlay =
      showHorizontalGradientOverlays &&
      !isShowingBorderRef.current &&
      !isScrollAtTheEndRef.current

    if (
      leftOverlayRef.current &&
      shouldShowLeftOverlay !== isLeftOverlayVisible.current
    ) {
      isLeftOverlayVisible.current = shouldShowLeftOverlay
      leftOverlayRef.current.setNativeProps({
        style: { opacity: shouldShowLeftOverlay ? 1 : 0 },
      })
    }

    if (
      rightOverlayRef.current &&
      shouldShowRightOverlay !== isRightOverlayVisible.current
    ) {
      isRightOverlayVisible.current = shouldShowRightOverlay
      rightOverlayRef.current.setNativeProps({
        style: { opacity: shouldShowRightOverlay ? 1 : 0 },
      })
    }
  }

  function onScroll(e: NativeSyntheticEvent<NativeScrollEvent>) {
    isScrollAtTheStartRef.current = e.nativeEvent.contentOffset.x < 1

    isScrollAtTheEndRef.current =
      e.nativeEvent.contentSize.width -
        e.nativeEvent.layoutMeasurement.width -
        e.nativeEvent.contentOffset.x <
      1

    updateOverlayVisibility()
  }

  useEffect(() => {
    updateOverlayVisibility()
  }, [])

  useEmitter(
    'FOCUS_ON_COLUMN',
    (payload: {
      columnId: string
      columnIndex: number
      animated?: boolean
      highlight?: boolean
    }) => {
      if (!flatListRef.current) return
      if (!(columnIds && columnIds.length)) return

      // the gradient overlay was covering the column focus border
      // so we hide the gradient overlay when showing the border
      // not proud of this but whatever
      if (payload.columnIndex >= 0 && payload.columnIndex < columnIds.length) {
        if (showHorizontalGradientOverlays) {
          isShowingBorderRef.current = true
          updateOverlayVisibility()
          setTimeout(() => {
            isShowingBorderRef.current = false
            updateOverlayVisibility()
          }, 1000)
        }

        flatListRef.current.scrollToIndex({
          animated: payload.animated,
          index: payload.columnIndex,
        })
      }
    },
    [flatListRef, columnIds],
  )

  const renderItem: FlatListProps<string>['renderItem'] = ({
    item: columnId,
  }) => {
    return (
      <ColumnContainer
        columnId={columnId}
        pagingEnabled={pagingEnabled}
        swipeable={swipeable}
      />
    )
  }

  const pagingEnabled = sizename < '3-large'
  const swipeable: boolean = false

  return (
    <>
      <FlatList
        ref={flatListRef}
        key="columns-flat-list"
        bounces={!swipeable}
        className="snap-container"
        data={columnIds}
        getItemLayout={(_data, index) => ({
          index,
          length: columnWidth,
          offset: index * columnWidth,
        })}
        horizontal
        initialNumToRender={4}
        keyExtractor={keyExtractor}
        onScroll={showHorizontalGradientOverlays ? onScroll : undefined}
        onScrollToIndexFailed={e => {
          console.error(e)
          bugsnag.notify({
            name: 'ScrollToIndexFailed',
            message: 'Failed to scroll to index',
            ...e,
          })
        }}
        pagingEnabled={pagingEnabled}
        removeClippedSubviews
        scrollEnabled={!swipeable}
        scrollEventThrottle={showHorizontalGradientOverlays ? 10 : undefined}
        {...otherProps}
        renderItem={renderItem}
        style={[styles.flatlist, style]}
      />

      {showHorizontalGradientOverlays && (
        <>
          <SafeAreaView
            collapsable={false}
            style={[StyleSheet.absoluteFill, { flexDirection: 'row' }]}
            pointerEvents="box-none"
          >
            <View
              ref={leftOverlayRef}
              collapsable={false}
              style={{ flex: 1 }}
              pointerEvents="box-none"
            >
              <AnimatedTransparentTextOverlay
                containerStyle={StyleSheet.absoluteFill}
                size={contentPadding}
                spacing={0}
                style={{
                  top: 0,
                  height: columnHeaderHeight,
                }}
                themeColor="backgroundColorLess1"
                to="right"
              />

              <AnimatedTransparentTextOverlay
                containerStyle={StyleSheet.absoluteFill}
                size={contentPadding}
                spacing={0}
                style={{
                  top: columnHeaderHeight + separatorTickSize,
                  bottom: 1,
                }}
                themeColor="backgroundColor"
                to="right"
              />
            </View>

            <View
              ref={rightOverlayRef}
              collapsable={false}
              style={{ flex: 1 }}
              pointerEvents="box-none"
            >
              <AnimatedTransparentTextOverlay
                containerStyle={StyleSheet.absoluteFill}
                size={contentPadding}
                spacing={0}
                style={{
                  top: 0,
                  height: columnHeaderHeight,
                }}
                themeColor="backgroundColorLess1"
                to="left"
              />

              <AnimatedTransparentTextOverlay
                containerStyle={StyleSheet.absoluteFill}
                size={contentPadding}
                spacing={0}
                style={{
                  top: columnHeaderHeight + separatorTickSize,
                  bottom: 1,
                }}
                themeColor="backgroundColor"
                to="left"
              />
            </View>
          </SafeAreaView>
        </>
      )}
    </>
  )
})
