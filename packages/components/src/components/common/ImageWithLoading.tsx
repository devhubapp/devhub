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

    useEffect(() => {
      updateStyles(imageRef, { ...propsRef.current, ...stateRef.current })
    }, [])

    useEffect(() => {
      if (!(Platform.realOS === 'web')) return

      const node = findNode(imageRef)
      if (!node) return

      node.title = tooltip || ''
      if (!tooltip && node.removeAttribute) node.removeAttribute('title')
    }, [imageRef.current, tooltip])

    const handleLoad = useCallback(e => {
      stateRef.current.isLoading = false
      stateRef.current.error = false
      updateStyles(imageRef, { ...propsRef.current, ...stateRef.current })

      if (typeof propsRef.current.onLoad === 'function')
        propsRef.current.onLoad(e)
    }, [])

    const handleLoadStart = useCallback(() => {
      stateRef.current.isLoading = true
      updateStyles(imageRef, { ...propsRef.current, ...stateRef.current })

      if (typeof propsRef.current.onLoadStart === 'function')
        propsRef.current.onLoadStart()
    }, [])

    const handleLoadEnd = useCallback(() => {
      stateRef.current.isLoading = false
      updateStyles(imageRef, { ...propsRef.current, ...stateRef.current })

      if (typeof propsRef.current.onLoadEnd === 'function')
        propsRef.current.onLoadEnd()
    }, [])

    const handleError = useCallback(e => {
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
      />
    )
  }),
)

function updateStyles(
  imageRef: RefObject<Image>,
  {
    error,
    isLoading,
    backgroundColorFailed,
    backgroundColorLoading,
    backgroundColorLoaded,
  }: { error: boolean; isLoading: boolean } & Pick<
    ImageWithLoadingProps,
    'backgroundColorFailed' | 'backgroundColorLoaded' | 'backgroundColorLoading'
  >,
) {
  if (!(imageRef && imageRef.current)) return

  imageRef.current.setNativeProps({
    style: {
      backgroundColor: error
        ? backgroundColorFailed
        : isLoading
        ? backgroundColorLoading
        : backgroundColorLoaded,
    },
  })
}
