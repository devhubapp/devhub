import throttle from 'lodash/throttle'
import React, { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { Platform, StyleSheet, View, ViewProps } from 'react-native'

import { findNode } from '../../utils/helpers/shared'

export interface AutoSizerProps extends Pick<ViewProps, 'style'> {
  children: ({
    width,
    height,
  }: {
    width: number | undefined
    height: number | undefined
  }) => React.ReactNode
  defaultHeight: number
  defaultWidth: number
  disableHeight?: boolean
  disableWidth?: boolean
  onResize?: ({ width, height }: { width: number; height: number }) => void
}

const styles = StyleSheet.create({
  container: { flex: 1 },
})

export function AutoSizer(props: AutoSizerProps) {
  const {
    children,
    defaultHeight,
    defaultWidth,
    disableHeight,
    disableWidth,
    onResize: _onResize,
    ...viewProps
  } = props

  const ref = useRef<View>(null)

  const widthRef = useRef(disableWidth ? 0 : defaultWidth || 0)
  const heightRef = useRef(disableHeight ? 0 : defaultHeight || 0)
  const [result, setResult] = useState({
    width: widthRef.current,
    height: heightRef.current,
  })

  const onResize = useCallback(
    throttle(({ width, height }: { width: number; height: number }) => {
      widthRef.current = disableWidth ? 0 : width || 0
      heightRef.current = disableHeight ? 0 : height || 0

      const newResult = { width: widthRef.current, height: heightRef.current }
      if (
        result.width === newResult.width &&
        result.height === newResult.height
      )
        return

      setResult(newResult)
      if (_onResize) _onResize(newResult)
    }, 50),
    [disableWidth, disableHeight, _onResize, result.width, result.height],
  )

  const onLayout = useCallback<NonNullable<ViewProps['onLayout']>>(
    e => {
      onResize({
        width: e.nativeEvent.layout.width,
        height: e.nativeEvent.layout.height,
      })
    },
    [onResize],
  )

  // Avoid zero/flash on first render, at least on web
  // @see https://github.com/bvaughn/react-virtualized-auto-sizer/blob/ffcba2dd39b89111ed4b42d64431f35ce7c1c23a/src/index.js#L69-L94
  // @see https://github.com/bvaughn/react-virtualized-auto-sizer/issues/10
  useLayoutEffect(() => {
    if (Platform.OS !== 'web') return

    const autoSizer = findNode(ref.current) as any

    if (
      autoSizer &&
      autoSizer.parentNode &&
      autoSizer.parentNode.ownerDocument &&
      autoSizer.parentNode.ownerDocument.defaultView &&
      autoSizer.parentNode instanceof
        autoSizer.parentNode.ownerDocument.defaultView.HTMLElement
    ) {
      const parentNode = autoSizer.parentNode
      const height = parentNode.offsetHeight || 0
      const width = parentNode.offsetWidth || 0
      if (width || height) onResize({ width, height })
    }
  }, [])

  return (
    <View
      {...viewProps}
      ref={ref}
      onLayout={onLayout}
      pointerEvents="box-none"
      style={[styles.container, viewProps.style]}
    >
      {children(result)}
    </View>
  )
}
