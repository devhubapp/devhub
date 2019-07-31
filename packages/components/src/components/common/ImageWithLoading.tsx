import _ from 'lodash'
import React, { RefObject, useCallback, useEffect, useRef } from 'react'
import { Image, ImageProps } from 'react-native'

import { Platform } from '../../libs/platform'
import { findNode } from '../../utils/helpers/shared'

export interface ImageWithLoadingProps extends ImageProps {
  animated?: boolean
  backgroundColorFailed: string | undefined
  backgroundColorLoaded: string | undefined
  backgroundColorLoading: string | undefined
  onError?: ImageProps['onError']
  onLoad?: ImageProps['onLoad']
  onLoadEnd?: ImageProps['onLoadEnd']
  onLoadStart?: ImageProps['onLoadStart']
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

    const imageRef = useRef<Image>(null)
    const stateRef = useRef({
      error: false,
      isLoading: false,
    })

    const propsRef = useRef({
      backgroundColorFailed,
      backgroundColorLoaded,
      backgroundColorLoading,
      onError,
      onLoad,
      onLoadEnd,
      onLoadStart,
    })
    propsRef.current.backgroundColorFailed = backgroundColorFailed
    propsRef.current.backgroundColorLoaded = backgroundColorLoaded
    propsRef.current.backgroundColorLoading = backgroundColorLoading
    propsRef.current.onError = onError
    propsRef.current.onLoad = onLoad
    propsRef.current.onLoadEnd = onLoadEnd
    propsRef.current.onLoadStart = onLoadStart

    const callbackRef = useRef({
      hasCalledOnError: false,
      hasCalledOnLoad: false,
      hasCalledOnLoadStart: false,
      hasCalledOnLoadEnd: false,
    })

    useEffect(() => {
      callbackRef.current = {
        hasCalledOnError: false,
        hasCalledOnLoad: false,
        hasCalledOnLoadStart: false,
        hasCalledOnLoadEnd: false,
      }
    }, [JSON.stringify(otherProps.source || {})])

    useEffect(() => {
      if (!(Platform.realOS === 'web')) return

      const node = findNode(imageRef)
      if (!node) return

      node.title = tooltip || ''
      if (!tooltip && node.removeAttribute) node.removeAttribute('title')
    }, [imageRef.current, tooltip])

    const handleLoad = useCallback(e => {
      if (callbackRef.current.hasCalledOnLoad) return
      callbackRef.current.hasCalledOnLoad = true

      stateRef.current.isLoading = false
      stateRef.current.error = false
      updateStyles(imageRef, { ...propsRef.current, ...stateRef.current })

      if (typeof propsRef.current.onLoad === 'function')
        propsRef.current.onLoad(e)
    }, [])

    const handleLoadStart = useCallback(() => {
      if (callbackRef.current.hasCalledOnLoadStart) return
      callbackRef.current.hasCalledOnLoadStart = true

      stateRef.current.isLoading = true
      updateStyles(imageRef, { ...propsRef.current, ...stateRef.current })

      if (typeof propsRef.current.onLoadStart === 'function')
        propsRef.current.onLoadStart()
    }, [])

    const handleLoadEnd = useCallback(() => {
      if (callbackRef.current.hasCalledOnLoadEnd) return
      callbackRef.current.hasCalledOnLoadEnd = true

      stateRef.current.isLoading = false
      updateStyles(imageRef, { ...propsRef.current, ...stateRef.current })

      if (typeof propsRef.current.onLoadEnd === 'function')
        propsRef.current.onLoadEnd()
    }, [])

    const handleError = useCallback(e => {
      if (callbackRef.current.hasCalledOnError) return
      callbackRef.current.hasCalledOnError = true

      stateRef.current.isLoading = false
      stateRef.current.error = true
      updateStyles(imageRef, { ...propsRef.current, ...stateRef.current })

      if (typeof propsRef.current.onError === 'function')
        propsRef.current.onError(e)
    }, [])

    return (
      <Image
        {...otherProps}
        ref={imageRef}
        onError={handleError}
        onLoad={handleLoad}
        onLoadEnd={handleLoadEnd}
        onLoadStart={handleLoadStart}
        style={[
          otherProps.style,
          getStyle({ ...propsRef.current, ...stateRef.current }),
        ]}
      />
    )
  }),
  _.isEqual,
)

ImageWithLoading.displayName = 'ImageWithLoading'

function getStyle({
  error,
  isLoading,
  backgroundColorFailed,
  backgroundColorLoading,
  backgroundColorLoaded,
}: { error: boolean; isLoading: boolean } & Pick<
  ImageWithLoadingProps,
  'backgroundColorFailed' | 'backgroundColorLoaded' | 'backgroundColorLoading'
>) {
  return {
    backgroundColor: error
      ? backgroundColorFailed
      : isLoading
      ? backgroundColorLoading
      : backgroundColorLoaded,
  }
}

function updateStyles(
  imageRef: RefObject<Image>,
  ...args: Parameters<typeof getStyle>
) {
  if (!(imageRef && imageRef.current)) return

  imageRef.current.setNativeProps({
    style: getStyle(...args),
  })
}
