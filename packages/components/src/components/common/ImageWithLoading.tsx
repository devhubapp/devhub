import React, { useCallback, useEffect, useRef } from 'react'
import { Image, ImageProps } from 'react-native'

import { Platform } from '../../libs/platform'
import { findNode } from '../../utils/helpers/shared'
import { SpringAnimatedImage } from '../animated/spring/SpringAnimatedImage'

export interface ImageWithLoadingProps extends ImageProps {
  animated?: boolean
  backgroundColorFailed: string | any
  backgroundColorLoaded: string | any
  backgroundColorLoading: string | any
  onError?: ImageProps['onError']
  onLoad?: ImageProps['onLoad']
  onLoadEnd?: ImageProps['onLoadEnd']
  onLoadStart?: ImageProps['onLoadStart']
  style: any
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
    const cacheRef = useRef({ error: false, isLoading: false })

    useEffect(() => {
      updateStyles()
    }, [])

    useEffect(() => {
      if (!(Platform.realOS === 'web')) return
      const node = findNode(imageRef)
      if (!node) return

      node.title = tooltip || ''
    }, [imageRef.current, tooltip])

    const handleLoad = useCallback(
      e => {
        cacheRef.current.isLoading = false
        cacheRef.current.error = false
        updateStyles()

        if (typeof onLoad === 'function') onLoad(e)
      },
      [onLoad],
    )

    const handleLoadStart = useCallback(() => {
      cacheRef.current.isLoading = true
      updateStyles()

      if (typeof onLoadStart === 'function') onLoadStart()
    }, [onLoadStart])

    const handleLoadEnd = useCallback(() => {
      cacheRef.current.isLoading = false
      updateStyles()

      if (typeof onLoadEnd === 'function') onLoadEnd()
    }, [onLoadEnd])

    const handleError = useCallback(
      e => {
        cacheRef.current.isLoading = false
        cacheRef.current.error = true
        updateStyles()

        if (typeof onError === 'function') onError(e)
      },
      [onError],
    )

    function updateStyles() {
      const { error, isLoading } = cacheRef.current

      if (imageRef.current) {
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
    }

    return (
      <SpringAnimatedImage
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
