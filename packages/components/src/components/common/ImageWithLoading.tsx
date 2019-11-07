import _ from 'lodash'
import React, {
  RefObject,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
} from 'react'
import {
  Image,
  ImageProps,
  ImageStyle,
  ImageURISource,
  View,
} from 'react-native'

import { Platform } from '../../libs/platform'
import { sharedStyles } from '../../styles/shared'
import { findNode } from '../../utils/helpers/shared'

export type LoadingState = 'loaded' | 'loading' | 'error'

export interface ImageWithLoadingProps
  extends Omit<ImageProps, 'source' | 'style'> {
  animated?: boolean
  backgroundColorFailed: string | undefined
  backgroundColorLoaded: string | undefined
  backgroundColorLoading: string | undefined
  onError?: ImageProps['onError']
  onLoad?: ImageProps['onLoad']
  onLoadEnd?: ImageProps['onLoadEnd']
  onLoadStart?: ImageProps['onLoadStart']
  source: ImageURISource
  tooltip?: string
  style?: Omit<ImageStyle, 'width' | 'height'> & {
    width?: number
    height?: number
  }
}

export const ImageWithLoading = React.memo(
  React.forwardRef<View, ImageWithLoadingProps>((props, ref) => {
    const {
      animated,
      backgroundColorFailed,
      backgroundColorLoaded,
      backgroundColorLoading,
      onError,
      onLoad,
      onLoadEnd,
      onLoadStart,
      style,
      tooltip,
      ...otherProps
    } = props

    const viewRef = useRef<View | null>(null)
    const loadingStateRef = useRef<LoadingState>('loading')
    const propsRef = useRef(props)

    const callbackRef = useRef({
      hasCalledOnError: false,
      hasCalledOnLoad: false,
      hasCalledOnLoadStart: false,
      hasCalledOnLoadEnd: false,
    })

    useLayoutEffect(() => {
      return () => {
        viewRef.current = null
      }
    }, [])

    useLayoutEffect(() => {
      propsRef.current = props
    })

    useLayoutEffect(() => {
      callbackRef.current = {
        hasCalledOnError: false,
        hasCalledOnLoad: false,
        hasCalledOnLoadStart: false,
        hasCalledOnLoadEnd: false,
      }
    }, [otherProps.source && otherProps.source.uri])

    useEffect(() => {
      if (!(Platform.OS === 'web' && !Platform.supportsTouch && tooltip)) return

      const node = findNode(viewRef)
      if (!node) return

      node.title = tooltip || ''
      if (!tooltip && node.removeAttribute) node.removeAttribute('title')
    }, [viewRef.current, tooltip])

    const handleLoad = useCallback(
      e => {
        loadingStateRef.current = 'loaded'

        if (!viewRef.current || callbackRef.current.hasCalledOnLoad) return
        callbackRef.current.hasCalledOnLoad = true

        updateStyles(viewRef, {
          ...propsRef.current,
          loadingState: loadingStateRef.current,
        })
        if (props.onLoad) props.onLoad(e)
      },
      [props.onLoad],
    )

    const handleLoadStart = useCallback(() => {
      loadingStateRef.current = 'loading'

      if (!viewRef.current || callbackRef.current.hasCalledOnLoadStart) return
      callbackRef.current.hasCalledOnLoadStart = true

      updateStyles(viewRef, {
        ...propsRef.current,
        loadingState: loadingStateRef.current,
      })
      if (props.onLoadStart) props.onLoadStart()
    }, [props.onLoadStart])

    const handleLoadEnd = useCallback(() => {
      loadingStateRef.current = 'loaded'

      if (!viewRef.current || callbackRef.current.hasCalledOnLoadEnd) return
      callbackRef.current.hasCalledOnLoadEnd = true

      updateStyles(viewRef, {
        ...propsRef.current,
        loadingState: loadingStateRef.current,
      })
      if (props.onLoadEnd) props.onLoadEnd()
    }, [props.onLoadEnd])

    const handleError = useCallback(
      e => {
        loadingStateRef.current = 'error'

        if (!viewRef.current || callbackRef.current.hasCalledOnError) return
        callbackRef.current.hasCalledOnError = true

        updateStyles(viewRef, {
          ...propsRef.current,
          loadingState: loadingStateRef.current,
        })
        if (props.onError) props.onError(e)
      },
      [props.onError],
    )

    return (
      <View
        style={[
          sharedStyles.relative,
          sharedStyles.overflowHidden,
          style && {
            width: style.width,
            height: style.height,
            borderRadius: style.borderRadius,
          },
        ]}
      >
        <View
          ref={viewRef}
          style={[
            sharedStyles.relative,
            sharedStyles.absolute,
            getStyles({
              backgroundColorFailed,
              backgroundColorLoaded,
              backgroundColorLoading,
              loadingState: loadingStateRef.current,
            }),
            !!(style && (style.width || style.height)) && {
              top: 1,
              bottom: 1,
              left: 1,
              right: 1,
              width: style.width
                ? style.width - Platform.select({ default: 0, web: 2 })
                : undefined,
              height: style.height
                ? style.height - Platform.select({ default: 0, web: 2 })
                : undefined,
              borderRadius: style.borderRadius
                ? style.borderRadius - Platform.select({ default: 0, web: 1 })
                : undefined,
            },
            sharedStyles.overflowHidden,
          ]}
        />

        <Image
          {...otherProps}
          onError={handleError}
          onLoad={handleLoad}
          onLoadEnd={handleLoadEnd}
          onLoadStart={handleLoadStart}
          onLayout={() => {
            if (
              !(
                callbackRef.current.hasCalledOnLoad ||
                callbackRef.current.hasCalledOnLoadEnd
              )
            ) {
              updateStyles(viewRef, {
                ...propsRef.current,
                loadingState: loadingStateRef.current,
              })
            }
          }}
          style={{ ...style, backgroundColor: undefined, overflow: 'hidden' }}
        />
      </View>
    )
  }),
)

ImageWithLoading.displayName = 'ImageWithLoading'

function getStyles({
  loadingState,
  backgroundColorFailed,
  backgroundColorLoading,
  backgroundColorLoaded,
}: { loadingState: LoadingState } & Pick<
  ImageWithLoadingProps,
  'backgroundColorFailed' | 'backgroundColorLoaded' | 'backgroundColorLoading'
>) {
  return {
    backgroundColor:
      loadingState === 'error'
        ? backgroundColorFailed
        : loadingState === 'loading'
        ? backgroundColorLoading
        : backgroundColorLoaded,
  }
}

function updateStyles(
  viewRef: RefObject<View | null>,
  params: Parameters<typeof getStyles>[0],
) {
  if (!(viewRef && viewRef.current)) return false

  viewRef.current.setNativeProps({
    style: getStyles(params),
  })
  return true
}
