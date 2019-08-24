import _ from 'lodash'
import React, {
  RefObject,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
} from 'react'
import { Image, ImageProps, ImageURISource } from 'react-native'

import { Platform } from '../../libs/platform'
import { findNode } from '../../utils/helpers/shared'

export type LoadingState = 'loaded' | 'loading' | 'error'

export interface ImageWithLoadingProps extends ImageProps {
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
}

export const ImageWithLoading = React.memo(
  React.forwardRef((props: ImageWithLoadingProps, ref) => {
    React.useImperativeHandle(ref, () => ({}))

    const {
      animated,
      backgroundColorFailed,
      backgroundColorLoaded,
      backgroundColorLoading,
      onError,
      onLoad,
      onLoadEnd,
      onLoadStart,
      tooltip,
      ...otherProps
    } = props

    const imageRef = useRef<Image | null>(null)
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
        imageRef.current = null
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

      const node = findNode(imageRef)
      if (!node) return

      node.title = tooltip || ''
      if (!tooltip && node.removeAttribute) node.removeAttribute('title')
    }, [imageRef.current, tooltip])

    const handleLoad = useCallback(
      e => {
        loadingStateRef.current = 'loaded'

        if (!imageRef.current || callbackRef.current.hasCalledOnLoad) return
        callbackRef.current.hasCalledOnLoad = true

        updateStyles(imageRef, {
          ...propsRef.current,
          loadingState: loadingStateRef.current,
        })
        if (props.onLoad) props.onLoad(e)
      },
      [props.onLoad],
    )

    const handleLoadStart = useCallback(() => {
      loadingStateRef.current = 'loading'

      if (!imageRef.current || callbackRef.current.hasCalledOnLoadStart) return
      callbackRef.current.hasCalledOnLoadStart = true

      updateStyles(imageRef, {
        ...propsRef.current,
        loadingState: loadingStateRef.current,
      })
      if (props.onLoadStart) props.onLoadStart()
    }, [props.onLoadStart])

    const handleLoadEnd = useCallback(() => {
      loadingStateRef.current = 'loaded'

      if (!imageRef.current || callbackRef.current.hasCalledOnLoadEnd) return
      callbackRef.current.hasCalledOnLoadEnd = true

      updateStyles(imageRef, {
        ...propsRef.current,
        loadingState: loadingStateRef.current,
      })
      if (props.onLoadEnd) props.onLoadEnd()
    }, [props.onLoadEnd])

    const handleError = useCallback(
      e => {
        loadingStateRef.current = 'error'

        if (!imageRef.current || callbackRef.current.hasCalledOnError) return
        callbackRef.current.hasCalledOnError = true

        updateStyles(imageRef, {
          ...propsRef.current,
          loadingState: loadingStateRef.current,
        })
        if (props.onError) props.onError(e)
      },
      [props.onError],
    )

    return (
      <Image
        {...otherProps}
        ref={imageRef}
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
            updateStyles(imageRef, {
              ...propsRef.current,
              loadingState: loadingStateRef.current,
            })
          }
        }}
        style={[
          props.style,
          getStyles({
            backgroundColorFailed,
            backgroundColorLoaded,
            backgroundColorLoading,
            loadingState: loadingStateRef.current,
          }),
        ]}
      />
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
  imageRef: RefObject<Image | null>,
  params: Parameters<typeof getStyles>[0],
) {
  if (!(imageRef && imageRef.current)) return false

  imageRef.current.setNativeProps({
    style: getStyles(params),
  })
  return true
}
