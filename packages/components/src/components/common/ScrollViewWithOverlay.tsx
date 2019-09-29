import _ from 'lodash'
import React, { Ref, useEffect, useRef } from 'react'
import {
  FlatList,
  ScrollView,
  ScrollViewProps,
  StyleSheet,
  View,
  ViewProps,
} from 'react-native'

import { sharedStyles } from '../../styles/shared'
import { contentPadding } from '../../styles/variables'
import {
  TransparentTextOverlay,
  TransparentTextOverlayProps,
} from '../common/TransparentTextOverlay'

export interface ScrollViewWithOverlayProps extends ScrollViewProps {
  ScrollViewComponent?: typeof ScrollView | typeof FlatList | any
  bottomOrRightOverlayThemeColor?: TransparentTextOverlayProps['themeColor']
  children?: React.ReactNode
  containerStyle?: ViewProps['style']
  overlaySize?: TransparentTextOverlayProps['size']
  overlaySpacing?: TransparentTextOverlayProps['spacing']
  topOrLeftOverlayThemeColor?: TransparentTextOverlayProps['themeColor']
}

export const ScrollViewWithOverlay = React.forwardRef(
  (props: ScrollViewWithOverlayProps, _ref: Ref<ScrollView>) => {
    const {
      ScrollViewComponent = ScrollView,
      containerStyle,
      horizontal,
      overlaySize = contentPadding / 2,
      overlaySpacing: _overlaySpacing,
      topOrLeftOverlayThemeColor = 'backgroundColor',
      bottomOrRightOverlayThemeColor = 'backgroundColor',
      ...restProps
    } = props

    const overlaySpacing =
      typeof _overlaySpacing === 'undefined'
        ? topOrLeftOverlayThemeColor === 'primaryBackgroundColor' ||
          bottomOrRightOverlayThemeColor === 'primaryBackgroundColor'
          ? '20%'
          : 0
        : _overlaySpacing

    const radius =
      typeof _overlaySpacing === 'undefined'
        ? topOrLeftOverlayThemeColor === 'primaryBackgroundColor' ||
          bottomOrRightOverlayThemeColor === 'primaryBackgroundColor'
          ? overlaySize
          : 0
        : 0

    const _defaultRef = useRef<ScrollView>(null)
    const ref = _ref || _defaultRef

    const layoutSizeRef = useRef({ width: 0, height: 0 })
    const contentSizeRef = useRef({ width: 0, height: 0 })
    const leftOrTopOverlayRef = useRef<View | null>(null)
    const rightOrBottomOverlayRef = useRef<View | null>(null)
    const isLeftOrTopOverlayVisible = useRef(null as boolean | null)
    const isRightOrBottomOverlayVisible = useRef(null as boolean | null)
    const isScrollAtTheStartRef = useRef(true)
    const isScrollAtTheEndRef = useRef(false)

    useEffect(() => {
      return () => {
        leftOrTopOverlayRef.current = null
        rightOrBottomOverlayRef.current = null
      }
    }, [])

    const updateOverlayVisibility = _.debounce(() => {
      const property = horizontal ? 'width' : 'height'

      const hasScroll = !!(
        layoutSizeRef.current &&
        layoutSizeRef.current[property] &&
        contentSizeRef.current &&
        contentSizeRef.current[property] &&
        contentSizeRef.current[property] > layoutSizeRef.current[property]
      )

      const shouldShowLeftOrTopOverlay =
        hasScroll && !isScrollAtTheStartRef.current
      const shouldShowRightOrBottomOverlay =
        hasScroll && !isScrollAtTheEndRef.current

      if (
        leftOrTopOverlayRef.current &&
        shouldShowLeftOrTopOverlay !== isLeftOrTopOverlayVisible.current
      ) {
        isLeftOrTopOverlayVisible.current = shouldShowLeftOrTopOverlay
        leftOrTopOverlayRef.current.setNativeProps({
          style: {
            opacity: shouldShowLeftOrTopOverlay ? 1 : 0,
          },
        })
      }

      if (
        rightOrBottomOverlayRef.current &&
        shouldShowRightOrBottomOverlay !== isRightOrBottomOverlayVisible.current
      ) {
        isRightOrBottomOverlayVisible.current = shouldShowRightOrBottomOverlay
        rightOrBottomOverlayRef.current.setNativeProps({
          style: { opacity: shouldShowRightOrBottomOverlay ? 1 : 0 },
        })
      }
    }, 100)

    const onScroll: ScrollViewProps['onScroll'] = e => {
      isScrollAtTheStartRef.current = horizontal
        ? e.nativeEvent.contentOffset.x < 1
        : e.nativeEvent.contentOffset.y < 1

      isScrollAtTheEndRef.current = horizontal
        ? e.nativeEvent.contentSize.width -
            e.nativeEvent.layoutMeasurement.width -
            e.nativeEvent.contentOffset.x <
          1
        : e.nativeEvent.contentSize.height -
            e.nativeEvent.layoutMeasurement.height -
            e.nativeEvent.contentOffset.y <
          1

      updateOverlayVisibility()

      if (props.onScroll) props.onScroll(e)
    }

    const onContentSizeChange: ScrollViewProps['onContentSizeChange'] = (
      width,
      height,
    ) => {
      contentSizeRef.current = { width, height }
      updateOverlayVisibility()

      if (props.onContentSizeChange) props.onContentSizeChange(width, height)
    }

    const onLayout: ScrollViewProps['onLayout'] = e => {
      const { width, height } = e.nativeEvent.layout
      layoutSizeRef.current = { width, height }
      updateOverlayVisibility()

      if (props.onLayout) props.onLayout(e)
    }

    return (
      <View collapsable={false} style={[sharedStyles.relative, containerStyle]}>
        <ScrollViewComponent
          ref={ref}
          horizontal={horizontal}
          scrollEventThrottle={16}
          updateCellsBatchingPeriod={0}
          {...restProps}
          collapsable={false}
          onContentSizeChange={onContentSizeChange}
          onLayout={onLayout}
          onScroll={onScroll}
        />

        <TransparentTextOverlay
          ref={leftOrTopOverlayRef}
          containerStyle={[
            StyleSheet.absoluteFill,
            !isLeftOrTopOverlayVisible.current && sharedStyles.opacity0,
          ]}
          radius={radius}
          size={overlaySize}
          spacing={overlaySpacing}
          themeColor={topOrLeftOverlayThemeColor}
          to={horizontal ? 'right' : 'bottom'}
        />

        <TransparentTextOverlay
          ref={rightOrBottomOverlayRef}
          containerStyle={[
            StyleSheet.absoluteFill,
            !isRightOrBottomOverlayVisible.current && sharedStyles.opacity0,
          ]}
          radius={radius}
          size={overlaySize}
          spacing={overlaySpacing}
          themeColor={bottomOrRightOverlayThemeColor}
          to={horizontal ? 'left' : 'top'}
        />
      </View>
    )
  },
)

ScrollViewWithOverlay.displayName = 'ScrollViewWithOverlay'
