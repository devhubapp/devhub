import React, { Ref, useEffect, useRef } from 'react'
import {
  ScrollView,
  ScrollViewProps,
  StyleSheet,
  View,
  ViewProps,
} from 'react-native'

import { FlatList } from '../../libs/flatlist'
import { contentPadding } from '../../styles/variables'
import {
  TransparentTextOverlay,
  TransparentTextOverlayProps,
} from '../common/TransparentTextOverlay'

export interface ScrollViewWithOverlayProps extends ScrollViewProps {
  ScrollViewComponent?: typeof ScrollView | typeof FlatList | any
  children?: React.ReactNode
  containerStyle?: ViewProps['style']
  overlayThemeColor?: TransparentTextOverlayProps['themeColor']
  overlaySize?: TransparentTextOverlayProps['size']
  overlaySpacing?: TransparentTextOverlayProps['spacing']
}

export const ScrollViewWithOverlay = React.forwardRef(
  (props: ScrollViewWithOverlayProps, _ref: Ref<ScrollView>) => {
    const {
      ScrollViewComponent = ScrollView,
      containerStyle,
      horizontal,
      overlaySize = contentPadding,
      overlaySpacing,
      overlayThemeColor = 'backgroundColor',
      ...restProps
    } = props

    const _defaultRef = useRef<ScrollView>(null)
    const ref = _ref || _defaultRef

    const layoutSizeRef = useRef({ width: 0, height: 0 })
    const contentSizeRef = useRef({ width: 0, height: 0 })
    const leftOrTopOverlayRef = useRef<View>(null)
    const rightOrBottomOverlayRef = useRef<View>(null)
    const isLeftOrTopOverlayVisible = useRef(null as boolean | null)
    const isRightOrBottomOverlayVisible = useRef(null as boolean | null)
    const isScrollAtTheStartRef = useRef(true)
    const isScrollAtTheEndRef = useRef(false)

    function updateOverlayVisibility() {
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
          style: { opacity: shouldShowLeftOrTopOverlay ? 1 : 0 },
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
    }

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

    useEffect(() => {
      updateOverlayVisibility()
    }, [leftOrTopOverlayRef.current, rightOrBottomOverlayRef.current])

    return (
      <View
        collapsable={false}
        style={[{ position: 'relative', flex: 1 }, containerStyle]}
      >
        <ScrollViewComponent
          ref={ref}
          horizontal={horizontal}
          scrollEventThrottle={3}
          {...restProps}
          collapsable={false}
          onContentSizeChange={onContentSizeChange}
          onLayout={onLayout}
          onScroll={onScroll}
        />

        <TransparentTextOverlay
          ref={leftOrTopOverlayRef}
          containerStyle={StyleSheet.absoluteFill}
          size={overlaySize}
          spacing={overlaySpacing}
          themeColor={overlayThemeColor}
          to={horizontal ? 'right' : 'bottom'}
        />

        <TransparentTextOverlay
          ref={rightOrBottomOverlayRef}
          containerStyle={StyleSheet.absoluteFill}
          size={overlaySize}
          spacing={overlaySpacing}
          themeColor={overlayThemeColor}
          to={horizontal ? 'left' : 'top'}
        />
      </View>
    )
  },
)
